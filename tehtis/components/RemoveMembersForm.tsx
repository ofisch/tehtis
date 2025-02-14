import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

interface RemoveMembersFormProps {
  toggleRemoveMembersBox: () => void;
  course: { name: string };
  onMembersRemoved: () => void;
}

export const RemoveMembersForm: React.FC<RemoveMembersFormProps> = ({
  toggleRemoveMembersBox,
  course,
  onMembersRemoved,
}) => {
  const { id } = useParams(); // haetaan kurssin ID osoitteesta
  const [members, setMembers] = useState<any[]>([]);

  const getCourseMembers = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/course-members/${id}`
      );
      const data = await response.json();
      console.log("testii: ", data);
      setMembers(data);
      console.log("members: ", members);
    } catch (error) {
      console.error("Error fetching course members", error);
    }
  };

  useEffect(() => {
    if (id) {
      getCourseMembers(id);
    }
  }, [id]); // Fetch course info whenever the id changes

  const [membersToRemove, setMembersToRemove] = useState<any[]>([]);

  const handleRemoveMember = (member: any) => {
    if (!membersToRemove.some((m) => m.id === member.id)) {
      setMembersToRemove([...membersToRemove, member]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const memberIds = membersToRemove.map((m) => m.id);

    try {
      const response = await fetch(
        "http://localhost:3000/remove-member-from-course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId: id, userIds: memberIds }), // Include courseId
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const notify = () =>
        toast.success("Osallistujat poistettu onnistuneesti", {
          position: "bottom-center",
          autoClose: 2500,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      notify();

      setTimeout(() => (toggleRemoveMembersBox(), onMembersRemoved()), 3000);
    } catch (error) {
      console.error("Error removing members", error);
    }
  };

  const handleRestoreMember = (member: any) => {
    setMembersToRemove(membersToRemove.filter((m) => m.id !== member.id));
  };

  return (
    <>
      <div className="back-shadow">
        <form className="remove-members-form" onSubmit={handleSubmit}>
          <h2>
            Poista osallistujia kurssilta <span>{course.name}</span>
          </h2>
          <div className="remove-members-form-content">
            <div>
              <ul className="remove-members-list">
                <li>
                  <h3>Osallistujat</h3>
                </li>
                {members.map((member: any) => {
                  return (
                    <li className="member" key={member.id}>
                      <h4 className="member-name">{member.name}</h4>

                      {membersToRemove.some((m) => m.id === member.id) ? (
                        <button
                          type="button"
                          className="removed-button"
                          disabled
                          onClick={() => handleRemoveMember(member)}
                        >
                          Poistettu
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="remove-member-button"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Poista
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              {membersToRemove.length > 0 && (
                <ul className="selected-members-list">
                  <li>
                    <h3>Poistettavat osallistujat</h3>
                  </li>
                  {membersToRemove.map((member: any) => {
                    return (
                      <li className="member" key={member.id}>
                        <h4 className="member-name">{member.name}</h4>

                        <button
                          type="button"
                          className="restore-button"
                          onClick={() => handleRestoreMember(member)}
                        >
                          <span>Palauta</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          <div className="buttons">
            <button className="cancel-button" onClick={toggleRemoveMembersBox}>
              Peruuta
            </button>
            <button type="submit">Poista osallistuja</button>
          </div>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

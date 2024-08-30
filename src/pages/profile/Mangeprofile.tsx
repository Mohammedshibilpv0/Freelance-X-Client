import React, { useEffect, useState } from "react";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import Store from "../../store/store";
import { profileValidation, countries } from "../../utility/Validator";
import { editUserProfile } from "../../api/user/userServices";
import ImageProfile from "./imageProfile";
import useShowToast from "../../Custom Hook/showToaster";
import { animateScroll as scroll } from "react-scroll";

interface ProfileProp {
  title: string;
  setEditUser: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToRef: React.RefObject<HTMLDivElement>;
  handleeditUser: () => void;
}

const Mangeprofile: React.FC<ProfileProp> = ({
  title,
  setEditUser,
  scrollToRef,
  handleeditUser,
}) => {
  const user = Store((config) => config.user);
  const { updateUser, setUser } = Store();

  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [secondName, setSecondName] = useState<string>(user.secondName);
  const [phone, setPhone] = useState<string>(user.phone);
  const [country, setCountry] = useState<string>(
    user.country ? user.country : countries[0]
  );
  const [skill, setSkill] = useState<string>("");
  const [description, setDescription] = useState<string>(user.description);
  const Toast = useShowToast();

  useEffect(() => {
    if (scrollToRef.current) {
      scroll.scrollTo(scrollToRef.current.offsetTop, {
        duration: 1000,
        smooth: 'easeInOutQuad',
      });
    }
  }, [scrollToRef]);

  const phoneValidation = (phone: string) => /^[0-9]*$/.test(phone);

  const handleAddSkill = () => {
    const isPureString = (skills: string) =>
      /^[A-Za-z\s]+$/.test(skills.trim());
    const normalizeSkill = (skill: string) =>
      skill.toLowerCase().replace(/\s+/g, "");

    const skills = skill.trim();

    if (skills === "" || skills.length < 3) {
      Toast("Minimum 3 characters required", "error", true);
      return;
    }

    if (!isPureString(skills)) {
      Toast("Only contain alphabets", "error", true);
      return;
    }
    let userSkills = user.skills.map((s) => normalizeSkill(s));
    if (userSkills.includes(skills.toLowerCase())) {
      Toast("Skill already exists", "error", true);
      return;
    }

    updateUser("skills", [...user.skills, skill]);
    setSkill("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkill = user.skills.filter(
      (skill: string) => skill !== skillToRemove
    );
    updateUser("skills", updatedSkill);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (/^[0-9]*$/.test(input)) {
      setPhone(input);
    }
  };

  const handleEditProfile = async () => {
    try {
      if (!phoneValidation(phone)) {
        Toast("Phone number must contain only numbers", "error", true);
        return;
      }

      const profileData = profileValidation(
        firstName,
        secondName,
        phone,
        country,
        description
      );
      if (profileData.length > 0) {
        profileData.forEach((error) => Toast(error, "error", true));
        return;
      }

      //const isUnchanged =
      //   user.firstName.trim() === firstName.trim() &&
      //   user.secondName.trim() === secondName.trim() &&
      //   // user.phone.trim() === phone.trim() &&
      //   user.country === country &&
      //   user.description.trim() === description.trim() &&
      //   JSON.stringify(user.skills) === JSON.stringify(user.skills);

      // if (isUnchanged) {
      //   Toast("No changes detected", "info", true);
      //   return;
      // }

      const skills = user.skills;
      const email = user.email;
      const profile = user.profile;
      const submitUserProfileData = await editUserProfile({
        email,
        firstName,
        secondName,
        phone,
        skills,
        country,
        description,
        profile,
      });

      if (submitUserProfileData.message) {
        Toast(submitUserProfileData.message, "success", true);
        setUser(submitUserProfileData.userData);
        setEditUser(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 fade-in">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-center text-2xl font-bold flex-1">{title}</h1>
        <p className="text-blue-500 cursor-pointer" onClick={handleeditUser}>Cancel</p>
      </div>

      <article className="max-w-4xl mx-auto">
        <section>
          <div className="flex justify-center">
            <div className="w-full max-w-lg p-4 rounded-xl bg-white">
              <ImageProfile />

              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="w-full">
                  <label className="mb-2 block text-gray-700">First Name</label>
                  <input
                    value={firstName}
                    type="text"
                    className="p-4 w-full border-2 rounded-lg text-gray-700"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label className="mb-2 block text-gray-700">Last Name</label>
                  <input
                    value={secondName}
                    type="text"
                    className="p-4 w-full border-2 rounded-lg text-gray-700"
                    placeholder="Last Name"
                    onChange={(e) => setSecondName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="w-full">
                  <label className="mb-2 block text-gray-700">Phone</label>
                  <input
                    value={phone}
                    type="tel"
                    className="p-4 w-full border-2 rounded-lg text-gray-700"
                    placeholder="Phone"
                    onChange={handlePhoneChange}
                  />
                </div>

                <div className="w-full mb-3">
                  <label className="mb-2 block text-gray-700">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border-2 rounded-lg p-4 text-gray-700"
                  >
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="w-full">
                  <label
                    htmlFor="skills"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Skills
                  </label>
                  <div className="relative">
                    <input
                      value={skill}
                      type="text"
                      id="skills"
                      className="p-4 w-full border-2 rounded-lg text-gray-700 pr-10"
                      placeholder="Enter Skill"
                      onChange={(e) => setSkill(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <BiSolidMessageSquareAdd
                      onClick={handleAddSkill}
                      size={29}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="w-full">
                  <div className="max-w-full overflow-hidden">
                    {user.skills.map((skill, index) => (
                      <p
                        key={index}
                        className="bg-blue-50 inline-flex items-center px-2 py-1 text-gray-700 ms-2 mt-2 rounded"
                      >
                        {skill}
                        <span className="ml-auto cursor-pointer">
                          <TiDelete
                            onClick={() => handleRemoveSkill(skill)}
                            className="ms-2 mb-2"
                            size={20}
                          />
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="w-full">
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      value={description}
                      id="message"
                      className="p-4 w-full border-2 rounded-lg text-gray-700"
                      placeholder="Leave a comment..."
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="w-full mt-4">
                <button
                  onClick={handleEditProfile}
                  className="w-full p-4 bg-blue-500 rounded-lg text-white text-lg font-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default Mangeprofile;

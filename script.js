document.getElementById("generateBtn").addEventListener("click", function () {
  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const education = document.getElementById("education").value;
  const skills = document.getElementById("skills").value;
  const experience = document.getElementById("experience").value;

  // Display data
  document.getElementById("r_name").innerText = name;
  document.getElementById("r_email").innerText = email;
  document.getElementById("r_phone").innerText = phone;
  document.getElementById("r_address").innerText = address;
  document.getElementById("r_education").innerText = education;
  document.getElementById("r_experience").innerText = experience;

  // Handle skills list
  const skillList = document.getElementById("r_skills");
  skillList.innerHTML = "";
  if (skills.trim() !== "") {
    skills.split(",").forEach(skill => {
      const li = document.createElement("li");
      li.textContent = skill.trim();
      skillList.appendChild(li);
    });
  }

  // Show resume output
  document.getElementById("resumeOutput").classList.remove("hidden");
});

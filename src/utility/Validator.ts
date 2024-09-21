export const isValidateEmail = (Email: string): boolean => {
  const allowedDomains = [
    "gmail.com",
    "outlook.com",
    "icloud.com",
    "yahoo.com",
  ];
  const emailRegex = /^[a-zA-Z0-9]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(Email)) {
    return false;
  }
  const domain = Email.split("@")[1];
  return allowedDomains.includes(domain);
};

export const isValidatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

export const profileValidation = (
  firstName: string,
  lastName: string,
  phone: string,
  country: string,
  description: string
) => {
  const errors: string[] = [];

  if (!firstName || firstName.trim() === "") {
    errors.push("First name is required.");
  } else if (!/^[A-Za-z]{3,}$/.test(firstName.trim())) {
    errors.push(
      "First name should be more than 2 characters and only contain alphabets."
    );
  }

  if (!lastName || lastName.trim() === "") {
    errors.push("Last name is required.");
  } else if (!/^[A-Za-z]+$/.test(lastName.trim())) {
    errors.push("Last name should only contain alphabets.");
  }

  if (phone == "") {
    errors.push("Phone number is required.");
  } else {
    const phoneLength = 10;

    if (phoneLength && phone.length !== phoneLength) {
      errors.push(
        `Phone number should be ${phoneLength} digits long for ${country}.`
      );
    }
  }

  if (!country || country.trim() === "") {
    errors.push("Country is required.");
  }

  if (!description || description.trim() === "") {
    errors.push("Description is required.");
  } else if (description.trim().length <= 10) {
    errors.push("Description should be more than 10 letters.");
  }

  return errors;
};

export const countries: string[] = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Russia",
  "South Africa",
  "Italy",
  "Spain",
  "Mexico",
];
export const validateProjectName = (projectName: string): string | undefined => {
  const trimmedName = projectName.trim(); 
  return trimmedName.length <= 3
    ? "Project name must be more than 3 letters and not just whitespace."
    : undefined;
};

export const validateDescription = (description: string): string | undefined => {
  return description.length <= 10
    ? "Description must be more than 10 letters."
    : undefined;
};

export const validateSkills = (skills: string[]): string | undefined => {
  return skills.length === 0 ? "At least one skill must be added." : undefined;
};

export const validateBudget = (
  startBudget: string,
  endBudget: string
): string | undefined => {
  const start = Number(startBudget);
  const end = Number(endBudget);

  if (start < 100 || end < 100) {
    return "Budget values must not be less than 100.";
  }

  if (start >= end) {
    return "End budget must be greater than start budget.";
  }

  return undefined;
};


export const validateDeadline = (deadline: string): string | undefined => {
  const today = new Date().toISOString().split("T")[0];
  return deadline <= today
    ? "Deadline must be greater than the current date."
    : undefined;
};

export const validateKeyPoints = (keyPoints: string[]): string | undefined => {
  return keyPoints.length === 0
    ? "At least one key point must be added."
    : undefined;
};

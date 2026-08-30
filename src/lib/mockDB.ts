export type MockUser = {
  id: string;
  email: string;
  password?: string;
  role: "ADMIN" | "APPLICANT";
  admin_level?: "PRESIDENT" | "HEAD" | "LEAD";
  fullName: string;
};

// Global object to persist across hot reloads during dev
declare global {
  var mockUsers: MockUser[] | undefined;
}

if (!global.mockUsers) {
  global.mockUsers = [
    {
      id: "admin-1",
      email: "president@codekrafters.org",
      password: "admin",
      role: "ADMIN",
      admin_level: "PRESIDENT",
      fullName: "President",
    },
    {
      id: "admin-2",
      email: "head@codekrafters.org",
      password: "head",
      role: "ADMIN",
      admin_level: "HEAD",
      fullName: "Head Admin",
    },
    {
      id: "user-1",
      email: "testuser@gmail.com",
      password: "user",
      role: "APPLICANT",
      fullName: "Test User",
    }
  ];
}

export const getMockUsers = () => global.mockUsers!;
export const setMockUsers = (users: MockUser[]) => {
  global.mockUsers = users;
};

declare global {
  namespace Express {
    interface User extends GoogleUser {
      id: string;
      displayName: string;
      emails: { value: string }[];
    }
  }
}

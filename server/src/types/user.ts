export interface GoogleUser {
  id: string;
  displayName: string;
  emails: { value: string }[];
}

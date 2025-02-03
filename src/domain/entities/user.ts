export interface I_User {
  id: string;
  firstname: string;
  lastname: string;
  phone?: string;
  mobile: string;
} 

export class User {
  private profile: I_User;

  constructor(profile: I_User) {
    this.profile = profile;
  }

  getPhone = () => this.profile.mobile;
  snapshot = () => this.profile;
}

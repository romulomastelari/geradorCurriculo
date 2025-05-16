import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUser: User = {
    id: '1',
    username: 'user1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isPremium: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor() {
    // In a real app, we would load the user from localStorage or from an API
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert string dates back to Date objects
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        parsedUser.updatedAt = new Date(parsedUser.updatedAt);
        this.mockUser = parsedUser;
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
  }

  /**
   * Check if the current user has a premium subscription
   */
  isPremiumUser(): boolean {
    return this.mockUser.isPremium;
  }

  /**
   * Get the current user
   */
  getUser(): User {
    return { ...this.mockUser }; // Return a copy to prevent mutation
  }

  /**
   * Update the user's premium status
   */
  updatePremiumStatus(isPremium: boolean): void {
    this.mockUser = {
      ...this.mockUser,
      isPremium,
      updatedAt: new Date()
    };

    // In a real app, we would also update the user on the server
    this.saveUserToStorage();
  }

  /**
   * Update user profile information
   */
  updateUserProfile(userUpdate: Partial<User>): User {
    this.mockUser = {
      ...this.mockUser,
      ...userUpdate,
      updatedAt: new Date()
    };

    // In a real app, we would also update the user on the server
    this.saveUserToStorage();

    return { ...this.mockUser };
  }

  /**
   * Save the current user to localStorage
   */
  private saveUserToStorage(): void {
    localStorage.setItem('currentUser', JSON.stringify(this.mockUser));
  }
}

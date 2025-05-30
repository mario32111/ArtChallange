// src/app/interfaces/user.model.ts
export interface User {
  uid: string;       // ID único (obligatorio)
  email: string;
  username?: string;  // Opcional
}

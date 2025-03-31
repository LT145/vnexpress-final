interface AuthCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface UserData {
  id: string;
  name: string | null | undefined;
  email?: string | null;
  avatar?: string | null | undefined;
  createdAt?: string;
  _originalName?: string | null;
}

export interface ProfileData {
  birthDate: string;
  gender: Gender;
  phone: string;
  address: string;
}

export interface EditingState {
  birthDate: boolean;
  gender: boolean;
  phone: boolean;
  address: boolean;
  name: boolean;
}

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PRIVATE" | "";

interface PersonalInfoProps {
  profileData: ProfileData;
  isEditing: EditingState;
  onEdit: (field: keyof EditingState) => void;
  onSave: (field: keyof EditingState) => void;
  onCancel: (field: keyof EditingState) => void;
  onFieldChange: (field: keyof ProfileData, value: string) => void;
}
interface AccountInfoProps {
  userData: UserData | null;
  isUploadingAvatar: boolean;
  isEditing: { name: boolean };
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditName: () => void;
  onSaveName: () => void;
  onCancelName: () => void;
  onNameChange: (name: string) => void;

    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}
interface SidebarProps {
  userData: UserData | null;
}
interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

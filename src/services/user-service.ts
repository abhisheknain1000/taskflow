import { API } from "@/lib/axios";
import { unwrapApiData } from "@/lib/api-utils";
import { User } from "@/types/user";

export const getAssignableUsers = async (): Promise<User[]> => {
  const response = await API.get("/users/assignable");
  return unwrapApiData<User[]>(response.data) ?? [];
};

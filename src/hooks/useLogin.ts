import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}
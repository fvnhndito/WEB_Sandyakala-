import bcrypt from "bcrypt";

const HashUtil = {
  hashPassword: async (
    password: string,
    saltRounds: number = 10,
  ): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
  },

  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  },
};

export default HashUtil;

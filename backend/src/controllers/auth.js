import User from "../models/user";



export const signup = (req, res)=>{
  const { email, fullName, password } = req.body;
  try {
    if(password.length < 6){
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = User.findOne({email})
    if (user){
        return res.status(400).json({ message: "Email already exists" });
    }
    const salt = bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword
    });
  } catch (error) {
    
  }
}

export const login = (req, res)=>{

}

export const logout = (req, res)=>{
    
}
import {
    CloseRounded,
    EmailRounded,
    PasswordRounded,
    Person,
    Visibility,
    VisibilityOff,
    TroubleshootRounded,
  } from "@mui/icons-material";
  import React, { useState, useEffect } from "react";
  import styled from "styled-components";
  import { useTheme } from "styled-components";
  import Google from "../Images/google.webp";
  import { IconButton, Modal } from "@mui/material";
  import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
  import { openSnackbar } from "../redux/snackbarSlice";
  import { useDispatch } from "react-redux";
  import axios from "axios";
  import CircularProgress from "@mui/material/CircularProgress";
  import validator from "validator";
  import { googleSignIn, signUp } from "../api/index";
  import OTP from "./OTP";
  import { useGoogleLogin } from "@react-oauth/google";
import { closeSignin, openSignin } from "../redux/setSigninSlice";
  
  
  const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const Wrapper = styled.div`
    width: 380px;
    border-radius: 16px;
    background-color: ${({ theme }) => theme.card};
    color: ${({theme}) => theme.text_secondary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
  `;
  
  const Title = styled.div`
    font-size: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
    margin: 16px 28px;
  `;
  const OutlinedBox = styled.div`
    height: 44px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.text_secondary};
    color: ${({ theme }) => theme.text_secondary};
    ${({ googleButton, theme }) =>
      googleButton &&
      `
      user-select: none; 
    gap: 16px;`}
    ${({ button, theme }) =>
      button &&
      `
      user-select: none; 
    border: none;
      background: ${theme.button};
      color: '${theme.text_secondary}';`}
      ${({ activeButton, theme }) =>
      activeButton &&
      `
      user-select: none; 
    border: none;
      background: ${theme.primary};
      color: white;`}
    margin: 3px 20px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    padding: 0px 14px;
  `;
  const GoogleIcon = styled.img`
    width: 22px;
  `;
  const Divider = styled.div`
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.text_secondary};
    font-size: 14px;
    font-weight: 600;
  `;
  const Line = styled.div`
    width: 80px;
    height: 1px;
    border-radius: 10px;
    margin: 0px 10px;
    background-color: ${({ theme }) => theme.text_secondary};
  `;
  
  const TextInput = styled.input`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const LoginText = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_secondary};
    margin: 20px 20px 38px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const Span = styled.span`
    color: ${({ theme }) => theme.primary};
  `;
  



  const DropdownContainer = styled.div`
  position: relative;
  height: 44px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  margin: 3px 20px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 14px;
`;

const Select = styled.select`
  border: none;
  background: transparent;
  font-size: 16px;
  width: 100%;
  appearance: none;
  &::placeholder {
    color: #b1b2b3;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: #fff;
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.li`
  padding: 8px 16px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

  
  const Error = styled.div`
    color: red;
    font-size: 10px;
    margin: 2px 26px 8px 26px;
    display: block;
    ${({ error, theme }) =>
      error === "" &&
      `    display: none;
      `}
  `;
  
const SignUp = ({ setSignUpOpen, setSignInOpen }) => {
  
    const [nameValidated, setNameValidated] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [credentialError, setcredentialError] = useState("");
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [nameCorrect, setNameCorrect] = useState(false);
    // const [gameGenre, gameGenre] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    const selectedIndex = selectedOptions.indexOf(option);
    let newSelectedOptions = [...selectedOptions];

    if (selectedIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(selectedIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
  };


    const [values, setValues] = useState({
      password: "",
      showPassword: false,
    });
  
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [gameOption, setGameOption] = useState('');

  const handleSelectChange = (event) => {
    gameOption(event.target.value);
  };
  
    const dispatch = useDispatch();
  
    const createAccount = () => {
      if (otpVerified) {
        dispatch(loginStart());
        setDisabled(true);
        setLoading(true);
        try {
          signUp({ name, email, password }).then((res) => {
            if (res.status === 200) {
              dispatch(loginSuccess(res.data));
              dispatch(
                openSnackbar({ message: `OTP verified & Account created successfully`, severity: "success" })
              );
              setLoading(false);
              setDisabled(false);
              setSignUpOpen(false);
              dispatch(closeSignin())
            } else {
              dispatch(loginFailure());
              setcredentialError(`${res.data.message}`);
              setLoading(false);
              setDisabled(false);
            }
          });
        } catch (err) {
          dispatch(loginFailure());
          setLoading(false);
          setDisabled(false);
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        }
      }
    };
  
    const handleSignUp = async (e) => {
      e.preventDefault();
      if (!disabled) {
        setOtpSent(true);
      }
  
      if (name === "" || email === "" || password === "") {
        dispatch(
          openSnackbar({
            message: "Please fill all the fields",
            severity: "error",
          })
        );
      }
    };
  
    useEffect(() => {
      if (email !== "") validateEmail();
      if (password !== "") validatePassword();
      if (name !== "") validateName();
      if (
        name !== "" &&
        validator.isEmail(email) &&
        passwordCorrect &&
        nameCorrect
      ) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }, [name, email, passwordCorrect, password, nameCorrect]);
  
    useEffect(() => {
      createAccount();
    }, [otpVerified]);
  
    //validate email
    const validateEmail = () => {
      if (validator.isEmail(email)) {
        setEmailError("");
      } else {
        setEmailError("Enter a valid Email Id!");
      }
    };
  
    //validate password
    const validatePassword = () => {
      if (password.length < 8) {
        setcredentialError("Password must be atleast 8 characters long!");
        setPasswordCorrect(false);
      } else if (password.length > 16) {
        setcredentialError("Password must be less than 16 characters long!");
        setPasswordCorrect(false);
      } else if (
        !password.match(/[a-z]/g) ||
        !password.match(/[A-Z]/g) ||
        !password.match(/[0-9]/g) ||
        !password.match(/[^a-zA-Z\d]/g)
      ) {
        setPasswordCorrect(false);
        setcredentialError(
          "Password must contain atleast one lowercase, uppercase, number and special character!"
        );
      } else {
        setcredentialError("");
        setPasswordCorrect(true);
      }
    };
  
    //validate name
    const validateName = () => {
      if (name.length < 4) {
        setNameValidated(false);
        setNameCorrect(false);
        setcredentialError("Name must be atleast 4 characters long!");
      } else {
        setNameCorrect(true);
        if (!nameValidated) {
          setcredentialError("");
          setNameValidated(true);
        }
  
      }
    };
  
    //Google SignIn
    const googleLogin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        setLoading(true);
        const user = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
        ).catch((err) => {
          dispatch(loginFailure());
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });
  
        googleSignIn({
          name: user.data.name,
          email: user.data.email,
          img: user.data.picture,
        }).then((res) => {
          console.log(res);
          if (res.status === 200) {
            dispatch(loginSuccess(res.data));
            dispatch(closeSignin())
            setSignUpOpen(false);
            dispatch(
              openSnackbar({
                message: "Logged In Successfully",
                severity: "success",
              })
            );
  
            setLoading(false);
          } else {
            dispatch(loginFailure(res.data));
            dispatch(
              openSnackbar({
                message: res.data.message,
                severity: "error",
              })
            );
            setLoading(false);
          }
        });
      },
      onError: errorResponse => {
        dispatch(loginFailure());
        dispatch(
          openSnackbar({
            message: errorResponse.error,
            severity: "error",
          })
        );
        setLoading(false);
      },
    });
  
  
    const theme = useTheme();
    //ssetSignInOpen(false)
    return (
      <Modal open={true} onClose={() => dispatch(closeSignin())}>
        <Container>
          <Wrapper>
            <CloseRounded
              style={{
                position: "absolute",
                top: "24px",
                right: "30px",
                cursor: "pointer",
                color: "inherit"
              }}
              onClick={() => setSignUpOpen(false)}
            />
            {!otpSent ?
              <>
                <Title>Sign Up</Title>
                <OutlinedBox
                  googleButton={TroubleshootRounded}
                  style={{ margin: "24px" }}
                  onClick={() => googleLogin()}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <>
                      <GoogleIcon src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png?20210618182606" />
                      Sign In with Google</>
                  )}
                </OutlinedBox>
                <Divider>
                  <Line />
                  or
                  <Line />
                </Divider>
                <OutlinedBox style={{ marginTop: "24px" }}>
                  <Person
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Full Name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </OutlinedBox>
                <OutlinedBox>
                  <EmailRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Email Id"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </OutlinedBox>
                <Error error={emailError}>{emailError}</Error>
                <OutlinedBox>
                  <PasswordRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    type={values.showPassword ? "text" : "password"}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    color="inherit"
                    onClick={() =>
                      setValues({ ...values, showPassword: !values.showPassword })
                    }
                  >
                    {values.showPassword ? (
                      <Visibility sx={{ fontSize: "20px" }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: "20px" }} />
                    )}
                  </IconButton>
                </OutlinedBox>
                <Error error={credentialError}>{credentialError}</Error>
                
                  <DropdownContainer>
                  <Person
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
      <Select
        value={selectedOptions.join(', ')}
        onChange={() => {}}
        onClick={toggleDropdown}
        placeholder="Select options..."
      />
      <DropdownList isOpen={isOpen}>
        <DropdownItem onClick={() => handleOptionClick('Option 1')}>
          <Checkbox
            type="checkbox"
            checked={selectedOptions.includes('Option 1')}
            readOnly
          />
          Option 1
        </DropdownItem>
        <DropdownItem onClick={() => handleOptionClick('Option 2')}>
          <Checkbox
            type="checkbox"
            checked={selectedOptions.includes('Option 2')}
            readOnly
          />
          Option 2
        </DropdownItem>
        <DropdownItem onClick={() => handleOptionClick('Option 3')}>
          <Checkbox
            type="checkbox"
            checked={selectedOptions.includes('Option 3')}
            readOnly
          />
          Option 3
        </DropdownItem>
        <DropdownItem onClick={() => handleOptionClick('Option 4')}>
          <Checkbox
            type="checkbox"
            checked={selectedOptions.includes('Option 4')}
            readOnly
          />
          Option 4
        </DropdownItem>
      </DropdownList>
    </DropdownContainer>
    
                  {/* <DropdownContainer>
      <Select value={gameOption} onChange={handleSelectChange}>
        <Option value="">Select an option...</Option>
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
        <Option value="option4">Option 4</Option>
      </Select>
    </DropdownContainer> */}
               
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "6px" }}
                  onClick={handleSignUp}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Create Account"
                  )}
                </OutlinedBox>
  
  
  
              </>
  
              :
              <OTP email={email} name={name} otpVerified={otpVerified} setOtpVerified={setOtpVerified} />
            }
            <LoginText>
              Already have an account ?
              <Span
                onClick={() => {
                  setSignUpOpen(false);
                  dispatch(openSignin());
                }}
                style={{
                  fontWeight: "500",
                  marginLeft: "6px",
                  cursor: "pointer",
                }}
              >
                Sign In
              </Span>
            </LoginText>
          </Wrapper>
        </Container>
      </Modal>
    );
  };

  export default SignUp;
  
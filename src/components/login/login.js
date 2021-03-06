import { Link, useHistory } from "react-router-dom";
import validation, { blurValidation } from "../../until/validation";
import { useState } from "react";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from "react-redux";
import { signIn, signUpAndSignInWithGoogle } from "../../redux/users/userSlice";

function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [values, setValues] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState({});
    const [checkAccLogin, setCheckAccLogin] = useState(false);
    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
        let clone = { ...error };
        delete clone[event.target.name];
        setError(clone);
        setCheckAccLogin(false);
    };
    const handleBlur = (event) => {
        const res = blurValidation(event.target.name, values);
        setError({
            ...error,
            ...res
        });
    };
    const handleSubmit = async () => {
        const res = validation(values);
        console.log(res)
        if (!Object.keys(res).length) {
            const user = {
                email: values.email,
                pass: values.password,
            };
            console.log(user)
            const res = await dispatch(signIn(user));
            console.log(res)
            if (res.error) {
                setCheckAccLogin(true);
            }
            else {
                history.goBack();
            }
        }
        setError({ ...res });

    };
    const handleBtnOut = () => {
        history.goBack();
    }
    const handleRegister = (event) => {
        event.preventDefault();
        history.replace("/register");
    }

    const loginGoogleSuccess = async (res) => {
        const data = {
            access_token: res.accessToken
        };
        const response = await dispatch(signUpAndSignInWithGoogle(data));
        if (response.error) {
            setCheckAccLogin(true);
        }
        else {
            history.goBack();
        }
    };

    const loginFail = () => {

    };

    const loginFacebookSuccess = (res) => {
        console.log(res)
    }


    return (
        <div className="modal">
            <div className="form form--login">
                <div className="form__container">
                    <div className="form__header">
                        <h3 className="form__heading">????ng nh???p</h3>
                        <Link to="/register" className="form__switch_btn form__switch_btn--register" onClick={handleRegister}>????ng k??</Link>
                    </div>
                    <div className="form__body">
                        <div className={error.email || checkAccLogin ? "form__input invalid" : "form__input"}>
                            <input type="text" id="email2" name="email" value={values.email} className="form__input-entry_bar"
                                onChange={handleChange} onBlur={handleBlur} placeholder="Nh???p gmail c???a b???n" />
                            <span className="form-message">{error.email ? error.email : ''}</span>
                            <span className="form-message">{checkAccLogin ? "Email ho???c m???t kh???u kh??ng ch??nh x??c" : ''}</span>
                        </div>
                        <div className={error.password || checkAccLogin ? "form__input invalid" : "form__input"}>
                            <input type="password" id="password2" className="form__input-entry_bar" name="password" value={values.password}
                                onChange={handleChange} onBlur={handleBlur} placeholder="Nh???p m???t kh???u c???a b???n" />
                            <span className="form-message">{error.password ? error.password : ''}</span>
                            <span className="form-message">{checkAccLogin ? "Email ho???c m???t kh???u kh??ng ch??nh x??c" : ''}</span>
                        </div>
                    </div>
                    <div className="form__aside">
                        <p className="form__policy form__policy--login">
                            <a href="true" className="form__policy-link form__policy-link--weight">Qu??n m???t kh???u</a>
                            <span className="form__policy-separate" />
                            <a href="true" className="form__policy-link form__policy-link--weight form__policy-link--color">C???n
                                tr??? gi??p?</a>
                        </p>
                    </div>
                    <div className="form__controls">
                        <button className="form__controls-btn btn btn--outLogin" onClick={handleBtnOut}>TR??? L???I</button>
                        <button className="form__controls-btn btn btn--color btn--login" onClick={handleSubmit}>????NG NH???P</button>
                    </div>
                </div>
                <div className="form__socials">
                    {/* <a href="true" className="form__link form__link--fb">
                        <i className="form__link-icon--fb fab fa-facebook-square" />
                        <span className="form__link-text">Li??n k???t v???i Facebook</span>
                    </a>
                    <a href="true" className="form__link form__link--gg">
                        <i className="form__link-icon--gg fab fa-google" />
                        <span className="form__link-text">Li??n k???t v???i Google</span>
                    </a> */}
                    <FacebookLogin
                        appId={process.env.EACT_APP_FACEBOOK_APP_ID}
                        autoLoad={true}
                        fields="name,email,picture"
                        callback={loginFacebookSuccess}
                        cssClass="form__link form__link--fb"
                        icon={<i className="form__link-icon--fb fab fa-facebook-square" />}
                        textButton="????ng nh???p v???i Facebook"
                    />
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        buttonText="????ng nh???p v???i Google"
                        onSuccess={loginGoogleSuccess}
                        onFailure={loginFail}
                        cookiePolicy={'single_host_origin'}
                        className="form__link form__link--gg"
                    />
                </div>
            </div>
        </div>
    )
}

export default Login;
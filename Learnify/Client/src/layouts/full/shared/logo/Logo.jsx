import { Link } from "react-router-dom";
// import { ReactComponent as LogoDark1 } from "../../../../assets/images/logos/dark1-logo.svg";
import { styled } from "@mui/material";
import logo from '../../../../assets/images/logos/dark1-logo.svg';
const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      height={50}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
     <img src={logo} alt="logo"/>
    </LinkStyled>
  );
};

export default Logo;
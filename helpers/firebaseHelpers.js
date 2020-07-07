export const errorMessage = (e) => {
  let errorMessage;
  switch (e.code) {
    case "auth/invalid-email":
      errorMessage = "La dirección de email no es valida.";
      break;
    case "auth/user-disabled":
      errorMessage = "Tu usuario fue suspendido.";
      break;
    case "auth/invalid-email":
      errorMessage = "La dirección de email no es valida.";
      break;
    case "auth/user-not-found":
      errorMessage = "Tu email no está registrado con ningún usuario.";
      break;
    case "auth/wrong-password":
      errorMessage = "Tu contraseña es incorrecta.";
      break;
    case "auth/email-already-in-use":
      errorMessage = "Tu email ya esta registrado, ¿olvidaste tu contraseña?";
      break;
    default:
      errorMessage = "Algo salió mal por favor vuelve a intentarlo.";
      break;
  }
  return errorMessage;
};

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      const destination = location.state?.from || "/";
      navigate(destination, { replace: true });
    } catch (loginError) {
      const messages = {
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/wrong-password": "La contraseña ingresada no es correcta.",
        "auth/invalid-credential": "El correo o la contraseña no son válidos.",
        "auth/invalid-email": "Ingresá un correo electrónico válido.",
        "auth/too-many-requests": "Demasiados intentos. Probá nuevamente más tarde.",
      };
      setError(messages[loginError.code] || "No se pudo iniciar sesión. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page section-shell">
      <div className="auth-card">
        <p className="eyebrow">Tu cuenta</p>
        <h1>Iniciar <span>sesión.</span></h1>
        <p className="auth-intro">Ingresá tus credenciales para continuar.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
        <p className="auth-switch">¿No tenés una cuenta? <Link to="/registro">Registrate aquí</Link></p>
      </div>
    </section>
  );
}

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signup(email.trim(), password);
      navigate("/", { replace: true });
    } catch (registrationError) {
      if (registrationError.code === "auth/email-already-in-use") {
        const wantsLogin = window.confirm(
          "Este correo electrónico ya está registrado. ¿Deseás intentar iniciar sesión?",
        );
        navigate(wantsLogin ? "/login" : "/", { replace: true });
      } else if (registrationError.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (registrationError.code === "auth/invalid-email") {
        setError("Ingresá un correo electrónico válido.");
      } else {
        setError("Ocurrió un error al registrar el usuario. Verificá los datos e intentá nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page section-shell">
      <div className="auth-card">
        <p className="eyebrow">Nueva cuenta</p>
        <h1>Crear <span>registro.</span></h1>
        <p className="auth-intro">Completá tus datos para acceder al perfil.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta…" : "Registrarse"}
          </button>
        </form>
        <p className="auth-switch">¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link></p>
      </div>
    </section>
  );
}

export default Registro;

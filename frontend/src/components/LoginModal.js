// Login Modal Component
export function LoginModal({ isOpen, loginPassword, setLoginPassword, handleLogin }) {
  if (!isOpen) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h2 id="modal-title">Login</h2>
        <div role="form">
          <label htmlFor="password-input" className="visually-hidden">
            Password
          </label>
          <input
            id="password-input"
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            aria-required="true"
            autoFocus
          />
          <button onClick={handleLogin} aria-label="Log in">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

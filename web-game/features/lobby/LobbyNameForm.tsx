import type { FormEventHandler } from 'react';

interface LobbyNameFormProps {
  label: string;
  action: string;
  pendingAction: string;
  helper: string;
  name: string;
  error: string;
  disabled: boolean;
  onNameChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function LobbyNameForm(props: LobbyNameFormProps) {
  return (
    <form className="join-form" onSubmit={props.onSubmit}>
      <label htmlFor="player-name">{props.label}</label>
      <div className="join-row">
        <input id="player-name" autoComplete="nickname" maxLength={48} value={props.name} onChange={(event) => props.onNameChange(event.target.value)} aria-describedby={props.error ? 'join-error' : 'name-help'} />
        <button type="submit" disabled={props.disabled}>{props.disabled ? props.pendingAction : props.action}</button>
      </div>
      <p id="name-help" className="helper">{props.helper}</p>
      {props.error && <p id="join-error" className="error-message" role="alert">{props.error}</p>}
    </form>
  );
}

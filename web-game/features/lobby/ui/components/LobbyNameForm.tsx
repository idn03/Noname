import type { FormEventHandler } from 'react';
import { Button } from '../../../../components/shared/Button';

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
      <label className="sr-only" htmlFor="player-name">{props.label}</label>
      <div className="join-row">
        <input id="player-name" placeholder="Tên hiển thị của bạn" autoComplete="nickname" maxLength={48} value={props.name} onChange={(event) => props.onNameChange(event.target.value)} aria-describedby={props.error ? 'join-error' : 'name-help'} />
        <Button type="submit" size="mobile" aria-label={props.disabled ? props.pendingAction : props.action} disabled={props.disabled}>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
        </Button>
      </div>
      <p id="name-help" className="helper">{props.helper}</p>
      {props.error && <p id="join-error" className="error-message" role="alert">{props.error}</p>}
    </form>
  );
}

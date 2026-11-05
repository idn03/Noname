import type { FormEventHandler } from 'react';
import { PressableText } from '../../../../components/shared/PressableText';

interface LobbyNameFormProps {
  label: string;
  action: string;
  pendingAction: string;
  helper?: string;
  name: string;
  error: string;
  disabled: boolean;
  onNameChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function LobbyNameForm(props: LobbyNameFormProps) {
  return (
    <form className="w-full max-w-[560px]" onSubmit={props.onSubmit}>
      <label className="sr-only" htmlFor="player-name">{props.label}</label>
      <div className="flex min-h-16 gap-2 border border-white/70 rounded-xl bg-[rgb(0_0_0/.18)] p-1.5">
        <input className="min-w-0 h-auto w-0 flex-1 border-0 rounded-[7px] bg-transparent text-white font-type-body text-base font-bold placeholder:text-white/60 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2" id="player-name" placeholder="Tên hiển thị của bạn" autoComplete="nickname" maxLength={48} value={props.name} onChange={(event) => props.onNameChange(event.target.value)} aria-describedby={props.error ? 'join-error' : props.helper ? 'name-help' : undefined} />
        <PressableText className="grid min-h-[50px] flex-[0_0_50px] place-items-center text-white font-type-body" type="submit" aria-label={props.disabled ? props.pendingAction : props.action} disabled={props.disabled}>
          <svg className="size-[26px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.7px]" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
        </PressableText>
      </div>
      {props.helper && <p id="name-help" className="mt-2 mx-1.5 text-white/65 font-type-body text-[13px] leading-[1.5]">{props.helper}</p>}
      {props.error && <p id="join-error" className="my-[14px] text-[#ffb6bd] text-[14px]" role="alert">{props.error}</p>}
    </form>
  );
}

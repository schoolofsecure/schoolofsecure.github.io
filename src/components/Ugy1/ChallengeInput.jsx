import React, { useState } from 'react'

export const normalizeText = (s) => {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^A-Za-z0-9\s]/g,'') // távolítsuk el az írásjeleket
    .replace(/\s+/g,' ')
    .trim()
    .toUpperCase();
};

const ChallengeInput = ({
  placeholder = 'válasz…',
  onCheck,
  okText = 'Helyes!',
  errText = 'Nem egészen – próbáld újra.',
  onSuccess,
  onFailure
}) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(null); // 'ok' | 'err' | null
  const onSubmit = () => {
    const res = onCheck ? onCheck(value, normalizeText) : false;
    setStatus(res ? 'ok' : 'err');
    if (res) {
      onSuccess && onSuccess();
    } else {
      onFailure && onFailure();
    }
  };
  return (
    <div>
      <div className="input-row">
        <input className="input" type="text" placeholder={placeholder} value={value} onChange={(e)=>setValue(e.target.value)} aria-label="válasz"/>
        <button className="btn" type="button" onClick={onSubmit}>Ellenőrzés</button>
      </div>
      {status && (
        <div className={'feedback ' + (status === 'ok' ? 'ok' : 'err')}>
          {status === 'ok' ? okText : errText}
        </div>
      )}
    </div>
  );
};

export default ChallengeInput



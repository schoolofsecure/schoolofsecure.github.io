import React, { useState } from 'react'

export const normalizeText = (s) => {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^A-Za-z0-9\s]/g,'')
    .replace(/\s+/g,' ')
    .trim()
    .toUpperCase();
};

const ChallengeInput = ({
  placeholder = 'your answer…',
  onCheck,
  okText = 'Good call. Continue when you are ready.',
  errText = 'Common under time pressure. Spot the cue and try again.',
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
      setValue('');
      onFailure && onFailure();
    }
  };
  return (
    <div>
      <div className="input-row">
        <input className="input" type="text" placeholder={placeholder} value={value} onChange={(e)=>setValue(e.target.value)} aria-label="answer"/>
        <button className="btn" type="button" onClick={onSubmit}>Check</button>
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

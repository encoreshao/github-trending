import React from 'react';
import { Input } from 'antd';

const TokenInput = ({ token, setToken, texts }) => {
  return (
    <div>
      <div style={{ marginBottom: 8, fontWeight: 500 }}>{texts.githubToken}</div>
      <Input.Password
        placeholder={texts.enterToken}
        value={token}
        onChange={e => setToken(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
};

export default TokenInput;
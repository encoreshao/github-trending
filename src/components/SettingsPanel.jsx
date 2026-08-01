import React from 'react';
import { Button, Divider, InputNumber, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import TokenInput from './TokenInput';
import AttributeSelector, { ATTRIBUTES } from './AttributeSelector';

const SettingsPanel = ({ token, setToken, attributes, setAttributes, lang, texts, pageSize, setPageSize }) => {
  // 重置字段为默认
  const handleResetFields = () => {
    setAttributes(ATTRIBUTES.slice(0, 9).map(a => a.key));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: 'var(--demo-text)', fontFamily: "'Space Grotesk', sans-serif" }}>{texts.settings}</h2>
      <TokenInput token={token} setToken={setToken} texts={texts} />
      <Divider />
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 500, color: 'var(--demo-text)' }}>{texts.selectFields}</span>
          <Tooltip title={texts.resetFields}>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              style={{ marginLeft: 8 }}
              onClick={handleResetFields}
            />
          </Tooltip>
        </div>
        <AttributeSelector attributes={attributes} setAttributes={setAttributes} texts={texts} lang={lang} />
      </div>
      <Divider />
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 500, color: 'var(--demo-text)' }}>{texts.pageSize}:</span>
        <InputNumber
          min={1}
          max={100}
          value={pageSize}
          onChange={setPageSize}
          style={{ width: 80, marginLeft: 8 }}
        />
      </div>
    </div>
  );
};

export default SettingsPanel;

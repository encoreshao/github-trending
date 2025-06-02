import React from 'react';
import { Button, Divider, message, InputNumber, Input, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import TokenInput from './TokenInput';
import AttributeSelector, { ATTRIBUTES } from './AttributeSelector';
import { fetchTrendingRepos } from '../api/github';

const SettingsPanel = ({ token, setToken, attributes, setAttributes, setRepos, setLoading, lang, texts, pageSize, setPageSize, category, setCategory }) => {
  // 触发抓取数据
  const handleFetch = async () => {
    setLoading(true);
    try {
      const repos = await fetchTrendingRepos(token, pageSize, category);
      // 只保留选中的字段，嵌套字段健壮处理
      const filtered = repos.map(repo => {
        const obj = {};
        attributes.forEach(attr => {
          if (attr.includes('.')) {
            const keys = attr.split('.');
            let value = repo;
            for (const k of keys) {
              if (value && typeof value === 'object' && k in value) {
                value = value[k];
              } else {
                value = '';
                break;
              }
            }
            obj[attr] = value;
          } else {
            obj[attr] = repo[attr];
          }
        });
        return obj;
      });
      setRepos(filtered);
    } catch (e) {
      message.error(texts.fetchError);
      setRepos([]);
    }
    setLoading(false);
  };

  // 重置字段为默认
  const handleResetFields = () => {
    setAttributes(ATTRIBUTES.slice(0, 9).map(a => a.key));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>{texts.settings}</h2>
      <TokenInput token={token} setToken={setToken} texts={texts} />
      <Divider />
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontWeight: 500 }}>{texts.selectFields}</span>
          <Tooltip title={lang === 'zh' ? '重置字段' : 'Reset Fields'}>
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
        <span style={{ fontWeight: 500 }}>{texts.pageSize}:</span>
        <InputNumber
          min={1}
          max={100}
          value={pageSize}
          onChange={setPageSize}
          style={{ width: 80, marginLeft: 8 }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>{texts.category}:</span>
        <Input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder={texts.category}
          style={{ width: '100%', marginTop: 4 }}
        />
      </div>
      <Button type="primary" block onClick={handleFetch} disabled={!token || !attributes.length}>
        {texts.fetch}
      </Button>
    </div>
  );
};

export default SettingsPanel;
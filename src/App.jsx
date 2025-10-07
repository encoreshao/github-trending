import React, { useState, useEffect } from 'react';
import { Layout, Select, Segmented } from 'antd';
import { TableOutlined, IdcardOutlined } from '@ant-design/icons';
import SettingsPanel from './components/SettingsPanel';
import RepoTable from './components/RepoTable';
import RepoCardView from './components/RepoCardView';
import './App.css';
import { ATTRIBUTES } from './components/AttributeSelector';

const { Sider, Content } = Layout;

const texts = {
  en: {
    settings: 'Settings',
    githubToken: 'GitHub Token',
    enterToken: 'Enter your GitHub Personal Token',
    selectFields: 'Select fields to display',
    fetch: 'Fetch Data',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    copy: 'Copy Data',
    copied: 'Copied to clipboard',
    copyFailed: 'Copy failed',
    fetchError: 'Fetch failed, please check your token',
    exportError: 'Export failed',
    tableNoData: 'No data',
    language: 'Language',
    pageSize: 'Per page',
    category: 'Category/Keyword (optional)',
    view: 'View',
    tableView: 'Table',
    cardView: 'Card',
  },
  zh: {
    settings: '工具设置',
    githubToken: 'GitHub 令牌',
    enterToken: '请输入你的 GitHub 个人令牌',
    selectFields: '选择展示字段',
    fetch: '抓取数据',
    exportCSV: '导出 CSV',
    exportJSON: '导出 JSON',
    copy: '复制数据',
    copied: '已复制',
    copyFailed: '复制失败',
    fetchError: '抓取失败，请检查令牌',
    exportError: '导出失败',
    tableNoData: '暂无数据',
    language: '语言',
    pageSize: '每页大小',
    category: '分类/关键词（可选）',
    view: '视图',
    tableView: '表格',
    cardView: '卡片',
  }
};

const SETTINGS_KEY = 'github_trending_settings';

function getDefaultSettings() {
  return {
    token: '',
    attributes: ATTRIBUTES.slice(0, 9).map(a => a.key),
    pageSize: 20,
    category: '',
    lang: 'en',
  };
}

function App() {
  // 初始化 settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 合并默认值，防止字段缺失
        return { ...getDefaultSettings(), ...parsed };
      } catch {
        return getDefaultSettings();
      }
    }
    return getDefaultSettings();
  });
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('card');

  // 每当 settings 变更时，写入 localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // 拆分 settings 传递给子组件
  const { token, attributes, pageSize, category, lang } = settings;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={320} style={{ background: '#fff', borderRight: '1px solid #eee' }}>
        <SettingsPanel
          token={token}
          setToken={t => setSettings(s => ({ ...s, token: t }))}
          attributes={attributes}
          setAttributes={a => setSettings(s => ({ ...s, attributes: a }))}
          setRepos={setRepos}
          setLoading={setLoading}
          lang={lang}
          texts={texts[lang]}
          pageSize={pageSize}
          setPageSize={n => setSettings(s => ({ ...s, pageSize: n }))}
          category={category}
          setCategory={c => setSettings(s => ({ ...s, category: c }))}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, right: 24, zIndex: 10, display: 'flex', gap: 16, alignItems: 'center' }}>
            <Segmented
              options={[
                { label: texts[lang].tableView, value: 'table', icon: <TableOutlined /> },
                { label: texts[lang].cardView, value: 'card', icon: <IdcardOutlined /> },
              ]}
              value={viewMode}
              onChange={setViewMode}
            />
            <Select
              value={lang}
              onChange={l => setSettings(s => ({ ...s, lang: l }))}
              style={{ width: 120 }}
              options={[
                { value: 'en', label: 'English' },
                { value: 'zh', label: '中文' },
              ]}
            />
          </div>
          {viewMode === 'table' ? (
            <RepoTable
              repos={repos}
              attributes={attributes}
              loading={loading}
              lang={lang}
              texts={texts[lang]}
              pageSize={pageSize}
            />
          ) : (
            <RepoCardView
              repos={repos}
              attributes={attributes}
              loading={loading}
              lang={lang}
              texts={texts[lang]}
              pageSize={pageSize}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
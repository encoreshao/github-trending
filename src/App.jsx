import React, { useState, useEffect } from 'react';
import { Layout, Select, Segmented } from 'antd';
import { TableOutlined, IdcardOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import SettingsPanel from './components/SettingsPanel';
import RepoTable from './components/RepoTable';
import RepoCardView from './components/RepoCardView';
import './App.css';
import { ATTRIBUTES } from './components/AttributeSelector';
import { texts, SUPPORTED_LANGUAGES } from './locales';

const { Sider, Content } = Layout;

const SETTINGS_KEY = 'github_trending_settings';
const SIDEBAR_COLLAPSED_KEY = 'github_trending_sidebar_collapsed';
// Matches the 340px override in DemoPage.css (the only place App is rendered)
const SIDER_WIDTH = 340;

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  );

  // 每当 settings 变更时，写入 localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // 拆分 settings 传递给子组件
  const { token, attributes, pageSize, category, lang } = settings;

  return (
    <Layout style={{ minHeight: '100vh', position: 'relative' }}>
      <Sider
        width={SIDER_WIDTH}
        collapsible
        collapsed={sidebarCollapsed}
        collapsedWidth={0}
        trigger={null}
        style={{ background: '#fff', borderRight: '1px solid #eee', transition: 'all 0.2s' }}
      >
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
      <button
        type="button"
        className="sidebar-toggle-btn"
        style={{ left: sidebarCollapsed ? 12 : SIDER_WIDTH - 14 }}
        onClick={() => setSidebarCollapsed(c => !c)}
        aria-label={sidebarCollapsed ? 'Expand settings panel' : 'Collapse settings panel'}
        title={sidebarCollapsed ? 'Expand settings panel' : 'Collapse settings panel'}
      >
        {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>
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
              options={SUPPORTED_LANGUAGES}
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
import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import SettingsPanel from './components/SettingsPanel';
import DataToolbar from './components/DataToolbar';
import RepoTable from './components/RepoTable';
import RepoCardView from './components/RepoCardView';
import './App.css';
import { ATTRIBUTES } from './components/AttributeSelector';
import { texts, SUPPORTED_LANGUAGES } from './locales';
import { fetchTrendingRepos } from './api/github';

const { Sider, Content } = Layout;

const SETTINGS_KEY = 'github_trending_settings';
const SIDEBAR_COLLAPSED_KEY = 'github_trending_sidebar_collapsed';
// Matches the 340px override in DemoPage.css (the only place App is rendered)
const SIDER_WIDTH = 340;
// Card view always shows these regardless of which fields the user picked
// in Settings — that selector only governs Table view's columns.
const CARD_REQUIRED_FIELDS = ['full_name', 'description', 'owner.login', 'owner.avatar_url', 'stargazers_count', 'html_url'];

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

  // 触发抓取数据；keyword 由数据工具栏的搜索框传入时会覆盖并保存当前 category
  const handleFetch = async (keyword) => {
    const categoryToUse = keyword !== undefined ? keyword : category;
    setLoading(true);
    try {
      const items = await fetchTrendingRepos(token, pageSize, categoryToUse);
      // 只保留选中的字段 + 卡片视图必需字段，嵌套字段健壮处理
      const fieldsToKeep = Array.from(new Set([...attributes, ...CARD_REQUIRED_FIELDS]));
      const filtered = items.map(repo => {
        const obj = {};
        fieldsToKeep.forEach(attr => {
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
      if (keyword !== undefined) {
        setSettings(s => ({ ...s, category: keyword }));
      }
    } catch (e) {
      message.error(texts[lang].fetchError);
      setRepos([]);
    }
    setLoading(false);
  };

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
          lang={lang}
          texts={texts[lang]}
          pageSize={pageSize}
          setPageSize={n => setSettings(s => ({ ...s, pageSize: n }))}
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
        <Content style={{ padding: 24 }}>
          <DataToolbar
            repos={repos}
            attributes={attributes}
            texts={texts[lang]}
            lang={lang}
            setLang={l => setSettings(s => ({ ...s, lang: l }))}
            langOptions={SUPPORTED_LANGUAGES}
            viewMode={viewMode}
            setViewMode={setViewMode}
            category={category}
            onSearch={handleFetch}
            loading={loading}
            canFetch={!!token && !!attributes.length}
          />
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

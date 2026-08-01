import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { ATTRIBUTES } from './AttributeSelector';

async function handleCellCopy(value) {
  try {
    await navigator.clipboard.writeText(value);
    message.success(texts.copied);
  } catch {
    message.error(texts.copyFailed, 1);
  }
}

const HEADER_HEIGHT = 40;
// Reserved space above the table for the shared DataToolbar rendered by App.jsx
const TOOLBAR_HEIGHT = 96;
const FOOTER_HEIGHT = 40;

const RepoTable = ({ repos, attributes, lang, texts, pageSize = 20 }) => {
  const tableBodyRef = useRef(null);
  const [bodyHeight, setBodyHeight] = useState(400);

  // 动态生成表头
  const columns = attributes.map(attrKey => {
    const attrConf = ATTRIBUTES.find(a => a.key === attrKey);
    return {
      title: attrConf ? attrConf.label[lang] : attrKey,
      dataIndex: attrKey,
      key: attrKey,
      render: (text, record) => {
        let value = record[attrKey];
        if (attrKey === 'owner.avatar_url' && value) {
          // 显示为图片，双击复制 URL
          return (
            <span
              style={{ cursor: 'pointer', display: 'inline-block' }}
              onDoubleClick={e => { e.preventDefault(); handleCellCopy(value); }}
              title={value}
            >
              <img src={value} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', verticalAlign: 'middle' }} />
            </span>
          );
        }
        if (attrKey === 'owner.login' && value) {
          // owner 显示文本，双击复制
          return (
            <span
              style={{ cursor: 'pointer', color: 'rgb(var(--c-text-secondary))', fontWeight: 500 }}
              onDoubleClick={e => { e.preventDefault(); handleCellCopy(value); }}
              title={value}
            >
              {value}
            </span>
          );
        }
        if (Array.isArray(value)) {
          value = attrKey === 'topics' ? value.slice(0, 2).join(', ') : value.join(', ');
        }
        if (value === undefined || value === null) value = '';
        if (typeof value === 'string' && value.includes('github.com')) {
          return (
            <a
              style={{
                cursor: 'pointer', 
                color: '#60A5FA',
                textWrap: 'nowrap', 
                overflow: 'hidden',
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                wordBreak: 'break-all', 
                display: 'block',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title={value}
              onMouseEnter={(e) => e.currentTarget.style.color = '#93C5FD'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#60A5FA'}
            >
              {value.replace(/(http|https):\/\/github\.com\//gi, '')}
            </a>
          );
        }
        if (attrKey === 'full_name') {
          return (
            <span
              onDoubleClick={e => { e.preventDefault(); handleCellCopy(value); }}
              style={{
                cursor: 'pointer',
                color: 'rgb(var(--c-text-body))',
                display: 'block',
                whiteSpace: 'normal',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
              title={value}
            >
              {value}
            </span>
          );
        }
        if (attrKey === 'description') {
          return (
            <span
              onDoubleClick={e => { e.preventDefault(); handleCellCopy(value); }}
              style={{
                cursor: 'pointer',
                color: 'rgb(var(--c-text-body))',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={value}
            >
              {value}
            </span>
          );
        }
        return (
          <span
            onDoubleClick={e => { e.preventDefault(); handleCellCopy(value); }}
            style={{ cursor: 'pointer', color: 'rgb(var(--c-text-body))' }}
            title={value}
          >
            {value}
          </span>
        );
      },
    };
  });

  // 动态设置表格内容区高度
  useEffect(() => {
    function updateBodyHeight() {
      const winH = window.innerHeight;
      const h = winH - TOOLBAR_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;
      setBodyHeight(h > 100 ? h : 100);
    }
    updateBodyHeight();
    window.addEventListener('resize', updateBodyHeight);
    return () => window.removeEventListener('resize', updateBodyHeight);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgb(var(--c-surface-alt) / 0.5)'
    }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            {columns.map(col => (
              <col key={col.key} style={{ minWidth: 10 }} />
            ))}
          </colgroup>
          <thead style={{
            background: 'rgb(var(--c-surface) / 0.8)',
            borderBottom: '1px solid rgb(var(--c-surface-alt) / 0.5)',
            height: HEADER_HEIGHT
          }}>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{
                  minWidth: 10,
                  fontWeight: 600,
                  padding: '12px 12px',
                  textAlign: 'left',
                  color: 'rgb(var(--c-text-heading))',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>{col.title}</th>
              ))}
            </tr>
          </thead>
        </table>
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          minHeight: 0, 
          maxHeight: bodyHeight,
          background: 'rgb(var(--c-bg) / 0.6)'
        }} ref={tableBodyRef}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              {columns.map(col => (
                <col key={col.key} style={{ minWidth: 10 }} />
              ))}
            </colgroup>
            <tbody>
              {repos.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{
                    textAlign: 'center',
                    color: 'rgb(var(--c-text-muted))',
                    padding: '64px 32px',
                    fontSize: '16px'
                  }}>{texts.tableNoData}</td>
                </tr>
              ) : (
                repos.slice(0, pageSize).map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    style={{
                      borderBottom: '1px solid rgb(var(--c-surface-alt) / 0.3)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{
                        minWidth: 10,
                        padding: '14px 12px',
                        verticalAlign: 'top',
                        color: 'rgb(var(--c-text-body))',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {col.render(null, row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default RepoTable;
import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
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
const ACTION_HEIGHT = 40;
const FOOTER_HEIGHT = 40;

const RepoTable = ({ repos, attributes, lang, texts, pageSize = 20 }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
              style={{ cursor: 'pointer', color: '#94A3B8', fontWeight: 500 }}
              onDoubleClick={e => { e.preventDefault(); handleCellCopy(value); }}
              title={value}
            >
              {value}
            </span>
          );
        }
        if (Array.isArray(value)) {
          value = value.join(', ');
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
        return (
          <span
            onDoubleClick={e => { e.preventDefault(); handleCellCopy(value); }}
            style={{ cursor: 'pointer', color: '#E2E8F0' }}
            title={value}
          >
            {value}
          </span>
        );
      },
    };
  });

  // 选中行数据
  const selectedRows = repos.filter((_, idx) => selectedRowKeys.includes(idx));

  // 导出 CSV
  const handleExportCSV = () => {
    try {
      const data = selectedRows.length ? selectedRows : repos;
      const csv = unparse(data, { columns: attributes });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'github-trending.csv');
    } catch (e) {
      message.error(texts.exportError);
    }
  };

  // 导出 JSON
  const handleExportJSON = () => {
    const data = selectedRows.length ? selectedRows : repos;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'github-trending.json');
  };

  // 复制
  const handleCopy = () => {
    message.success(texts.copied);
  };

  // 动态设置表格内容区高度
  useEffect(() => {
    function updateBodyHeight() {
      const winH = window.innerHeight;
      // 5% action + 5% header + 5% footer, 85% content
      const h = winH - ACTION_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;
      setBodyHeight(h > 100 ? h : 100);
    }
    updateBodyHeight();
    window.addEventListener('resize', updateBodyHeight);
    return () => window.removeEventListener('resize', updateBodyHeight);
  }, []);

  return (
    <div style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* Action Bar */}
      <div style={{ 
        flex: '0 0 auto', 
        minHeight: ACTION_HEIGHT, 
        display: 'flex', 
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
      }}>
        <Space>
          <Button onClick={handleExportCSV} disabled={!repos.length} style={{ padding: '0 10px' }}>{texts.exportCSV}</Button>
          <Button onClick={handleExportJSON} disabled={!repos.length} style={{ padding: '0 10px' }}>{texts.exportJSON}</Button>
          <CopyToClipboard
            text={JSON.stringify(selectedRows.length ? selectedRows : repos, null, 2)}
            onCopy={handleCopy}
          >
            <Button disabled={!repos.length} style={{ padding: '0 10px' }}>{texts.copy}</Button>
          </CopyToClipboard>
        </Space>
      </div>
      {/* Table (header + body) */}
      <div style={{ 
        flex: '1 1 90%', 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        marginTop: '16px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            {columns.map(col => (
              <col key={col.key} style={{ minWidth: 10 }} />
            ))}
          </colgroup>
          <thead style={{ 
            background: 'rgba(30, 41, 59, 0.8)', 
            borderBottom: '1px solid rgba(51, 65, 85, 0.5)', 
            height: HEADER_HEIGHT 
          }}>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ 
                  minWidth: 10, 
                  fontWeight: 600, 
                  padding: '12px 12px', 
                  textAlign: 'left', 
                  color: '#F1F5F9',
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
          background: 'rgba(15, 23, 42, 0.6)'
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
                    color: '#64748B', 
                    padding: '64px 32px',
                    fontSize: '16px'
                  }}>{texts.tableNoData}</td>
                </tr>
              ) : (
                repos.slice(0, pageSize).map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    style={{ 
                      borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
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
                        color: '#E2E8F0',
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
    </div>
  );
};

export default RepoTable;
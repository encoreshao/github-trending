import React from 'react';
import { Button, Dropdown, Input, Select, Segmented, Space, message } from 'antd';
import { DownOutlined, TableOutlined, IdcardOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

const DataToolbar = ({
  repos,
  attributes,
  texts,
  lang,
  setLang,
  langOptions,
  viewMode,
  setViewMode,
  category,
  onSearch,
  loading,
  canFetch,
}) => {
  const handleExportCSV = () => {
    try {
      const csv = unparse(repos, { columns: attributes });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'github-trending.csv');
    } catch (e) {
      message.error(texts.exportError);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(repos, null, 2)], { type: 'application/json' });
    saveAs(blob, 'github-trending.json');
  };

  const handleCopy = () => {
    message.success(texts.copied);
  };

  const exportMenuItems = [
    { key: 'csv', label: texts.exportCSV },
    { key: 'json', label: texts.exportJSON },
  ];
  const handleExportMenuClick = ({ key }) => {
    if (key === 'csv') handleExportCSV();
    else if (key === 'json') handleExportJSON();
  };

  return (
    <div className="data-toolbar">
      <Input.Search
        className="data-toolbar-search"
        size="large"
        defaultValue={category}
        placeholder={texts.categoryPlaceholder}
        enterButton={texts.search}
        loading={loading}
        disabled={!canFetch}
        onSearch={value => onSearch(value)}
      />
      <div className="data-toolbar-actions">
        <Space>
          <Dropdown menu={{ items: exportMenuItems, onClick: handleExportMenuClick }} disabled={!repos.length}>
            <Button size="large" disabled={!repos.length}>{texts.export} <DownOutlined /></Button>
          </Dropdown>
          <CopyToClipboard text={JSON.stringify(repos, null, 2)} onCopy={handleCopy}>
            <Button size="large" disabled={!repos.length}>{texts.copy}</Button>
          </CopyToClipboard>
        </Space>
        <Segmented
          size="large"
          options={[
            { label: texts.tableView, value: 'table', icon: <TableOutlined /> },
            { label: texts.cardView, value: 'card', icon: <IdcardOutlined /> },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
        <Select
          size="large"
          value={lang}
          onChange={setLang}
          style={{ width: 130 }}
          options={langOptions}
        />
      </div>
    </div>
  );
};

export default DataToolbar;

import React from 'react';
import { Checkbox } from 'antd';

const ATTRIBUTES = [
  { key: 'full_name', label: { en: 'Repository', zh: '仓库' } },
  { key: 'stargazers_count', label: { en: 'Stars', zh: '星标数' } },
  { key: 'owner.login', label: { en: 'Owner', zh: '所有者' } },
  { key: 'owner.avatar_url', label: { en: 'Avatar', zh: '头像' } },
  { key: 'description', label: { en: 'Description', zh: '描述' } },
  { key: 'topics', label: { en: 'Topics', zh: '主题' } },
  { key: 'html_url', label: { en: 'URL', zh: '链接' } },
  { key: 'created_at', label: { en: 'Created At', zh: '创建时间' } },
  { key: 'updated_at', label: { en: 'Updated At', zh: '更新时间' } },
  { key: 'pushed_at', label: { en: 'Pushed At', zh: '推送时间' } },
  { key: 'git_url', label: { en: 'Git URL', zh: 'Git 地址' } },
  { key: 'ssh_url', label: { en: 'SSH URL', zh: 'SSH 地址' } },
  { key: 'clone_url', label: { en: 'Clone URL', zh: '克隆地址' } },
  { key: 'svn_url', label: { en: 'SVN URL', zh: 'SVN 地址' } },
  { key: 'homepage', label: { en: 'Homepage', zh: '主页' } },
  { key: 'size', label: { en: 'Size', zh: '大小' } },
  { key: 'language', label: { en: 'Language', zh: '语言' } },
  { key: 'forks_count', label: { en: 'Forks', zh: '分支数' } },
  { key: 'open_issues_count', label: { en: 'Open Issues', zh: '未解决问题' } },
  { key: 'default_branch', label: { en: 'Default Branch', zh: '默认分支' } },
  { key: 'license.name', label: { en: 'License', zh: '许可证' } },
];

const AttributeSelector = ({ attributes, setAttributes, texts, lang }) => {
  const options = ATTRIBUTES.map(attr => ({
    label: attr.label[lang],
    value: attr.key,
  }));
  return (
    <div>
      <Checkbox.Group
        options={options}
        value={attributes}
        onChange={setAttributes}
        style={{ display: 'flex', flexDirection: 'column' }}
      />
    </div>
  );
};

// 导出 attributes 配置供 RepoTable 使用
export { ATTRIBUTES };
export default AttributeSelector;
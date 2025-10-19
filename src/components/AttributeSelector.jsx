import React from 'react';
import { Checkbox } from 'antd';

const ATTRIBUTES = [
  { key: 'full_name', label: { en: 'Repository', zh: '仓库', fr: 'Dépôt' } },
  { key: 'stargazers_count', label: { en: 'Stars', zh: '星标数', fr: 'Étoiles' } },
  { key: 'owner.login', label: { en: 'Owner', zh: '所有者', fr: 'Propriétaire' } },
  { key: 'owner.avatar_url', label: { en: 'Avatar', zh: '头像', fr: 'Avatar' } },
  { key: 'description', label: { en: 'Description', zh: '描述', fr: 'Description' } },
  { key: 'topics', label: { en: 'Topics', zh: '主题', fr: 'Sujets' } },
  { key: 'html_url', label: { en: 'URL', zh: '链接', fr: 'URL' } },
  { key: 'created_at', label: { en: 'Created At', zh: '创建时间', fr: 'Créé le' } },
  { key: 'updated_at', label: { en: 'Updated At', zh: '更新时间', fr: 'Mis à jour le' } },
  { key: 'pushed_at', label: { en: 'Pushed At', zh: '推送时间', fr: 'Poussé le' } },
  { key: 'git_url', label: { en: 'Git URL', zh: 'Git 地址', fr: 'URL Git' } },
  { key: 'ssh_url', label: { en: 'SSH URL', zh: 'SSH 地址', fr: 'URL SSH' } },
  { key: 'clone_url', label: { en: 'Clone URL', zh: '克隆地址', fr: 'URL de clonage' } },
  { key: 'svn_url', label: { en: 'SVN URL', zh: 'SVN 地址', fr: 'URL SVN' } },
  { key: 'homepage', label: { en: 'Homepage', zh: '主页', fr: 'Page d\'accueil' } },
  { key: 'size', label: { en: 'Size', zh: '大小', fr: 'Taille' } },
  { key: 'language', label: { en: 'Language', zh: '语言', fr: 'Langage' } },
  { key: 'forks_count', label: { en: 'Forks', zh: '分支数', fr: 'Fourches' } },
  { key: 'open_issues_count', label: { en: 'Open Issues', zh: '未解决问题', fr: 'Problèmes ouverts' } },
  { key: 'default_branch', label: { en: 'Default Branch', zh: '默认分支', fr: 'Branche par défaut' } },
  { key: 'license.name', label: { en: 'License', zh: '许可证', fr: 'Licence' } },
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
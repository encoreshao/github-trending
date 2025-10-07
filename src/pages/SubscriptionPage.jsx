import React, { useState } from 'react';
import { Button, Card, Checkbox, Input } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, GithubOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');

  const categories = [
    { id: 'javascript', name: 'JavaScript', description: 'Web development and frameworks', icon: '⚡' },
    { id: 'python', name: 'Python', description: 'Data science and automation', icon: '🐍' },
    { id: 'react', name: 'React', description: 'Frontend frameworks and libraries', icon: '⚛️' },
    { id: 'vue', name: 'Vue.js', description: 'Progressive JavaScript framework', icon: '💚' },
    { id: 'nodejs', name: 'Node.js', description: 'Server-side JavaScript', icon: '🟢' },
    { id: 'typescript', name: 'TypeScript', description: 'Typed JavaScript superset', icon: '🔷' },
    { id: 'ai', name: 'AI & Machine Learning', description: 'Artificial intelligence and ML', icon: '🤖' },
    { id: 'ai-agents', name: 'AI Agents', description: 'Autonomous AI agents and assistants', icon: '🤖' },
    { id: 'llm', name: 'Large Language Models', description: 'LLMs, GPT, and language AI', icon: '🧠' },
    { id: 'computer-vision', name: 'Computer Vision', description: 'Image and video processing', icon: '👁️' },
    { id: 'nlp', name: 'Natural Language Processing', description: 'Text analysis and language AI', icon: '💬' },
    { id: 'deep-learning', name: 'Deep Learning', description: 'Neural networks and deep learning', icon: '🧠' },
    { id: 'generative-ai', name: 'Generative AI', description: 'Text, image, and video generation', icon: '🎨' },
    { id: 'blockchain', name: 'Blockchain', description: 'Cryptocurrency and Web3', icon: '⛓️' },
    { id: 'mobile', name: 'Mobile Development', description: 'iOS and Android apps', icon: '📱' },
    { id: 'devops', name: 'DevOps', description: 'Infrastructure and deployment', icon: '🔧' },
    { id: 'security', name: 'Security', description: 'Cybersecurity and privacy', icon: '🔒' },
    { id: 'design', name: 'Design', description: 'UI/UX and graphics', icon: '🎨' }
  ];

  const handleCategoryChange = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleSubscribe = () => {
    // Here you would typically integrate with a payment processor
    console.log('Subscription details:', {
      categories: selectedCategories,
      email,
      githubUsername
    });
    // For demo purposes, navigate to demo page
    navigate('/demo');
  };

  return (
    <div className="subscription-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="back-button"
          >
            Back to Home
          </Button>
          <div className="nav-logo">
            <GithubOutlined className="logo-icon" />
            <span className="logo-text">GitHub Trending</span>
          </div>
          <div className="nav-links">
            <a href="https://github.com/encoreshao/github-trending" target="_blank" rel="noopener noreferrer" className="nav-link">
              <GithubOutlined style={{ marginRight: 4 }} />
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <div className="subscription-container">
        <div className="subscription-header">
          <h1 className="subscription-title">Subscribe to GitHub Trending</h1>
          <p className="subscription-subtitle">
            Get personalized trending repositories based on your interests
          </p>
        </div>

        {/* Category Selection */}
        <div className="category-section">
          <h2 className="section-title">Choose Your Interests</h2>
          <p className="section-subtitle">
            Select the categories you're interested in to get personalized trending repositories
          </p>
          <div className="category-grid">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`category-card ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                hoverable
                onClick={() => {
                  if (selectedCategories.includes(category.id)) {
                    setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                  } else {
                    setSelectedCategories([...selectedCategories, category.id]);
                  }
                }}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  className="category-checkbox"
                />
              </Card>
            ))}
          </div>
        </div>

        {/* User Information */}
        <div className="user-info-section">
          <h2 className="section-title">Your Information</h2>
          <div className="user-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <Input
                size="large"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub Username (Optional)</label>
              <Input
                size="large"
                placeholder="your-github-username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="form-input"
                prefix={<GithubOutlined />}
              />
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="subscribe-section">
          <Button
            type="primary"
            size="large"
            className="subscribe-button"
            onClick={handleSubscribe}
            icon={<RocketOutlined />}
            disabled={!email || selectedCategories.length === 0}
          >
            Subscribe Now
          </Button>
          <p className="subscribe-note">
            You'll be redirected to complete your subscription setup
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

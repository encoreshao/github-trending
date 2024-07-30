# GitHub - Weekly Trending Repositories (2024 Active)

This project is a Node.js script that fetches the top 20 trending GitHub repositories created in the last week, and saves the data into a markdown file.
The markdown file is saved in the `docs` directory with the current date as the filename.
The script is set up to run daily as a cron job, automatically generating the markdown file, committing the changes to a Git repository, and pushing the updates.

## Features

- Fetches top 20 trending GitHub repositories created in the last week.
- Saves repository data into a markdown file in the `docs` directory.
- Each markdown file includes repository details such as name, stars, owner, avatar, description, topics, URLs, and other relevant details.
- Automatically runs daily via a cron job, commits the changes, and pushes to a Git repository.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Git
- A GitHub Personal Access Token with `repo` and `read:user` scopes.

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/encoreshao/github-trending.git
   cd github-trending
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory of the project and add your GitHub Personal Access Token:

   ```env
   GITHUB_TOKEN=your_github_token
   ```

## Usage

1. **Run the script manually:**

   You can run the script manually to fetch the trending repositories and save the data into a markdown file:

   ```sh
   node index.js
   ```

2. **Set up the cron job:**

   To automate the process, set up a cron job to run the script daily. Edit your crontab file:

   ```sh
   crontab -e
   ```

   Add the following line to run the script every day at midnight:

   ```sh
   0 0 * * * /path/to/your/project/scripts/run.sh
   ```

   Replace `/path/to/your/project/scripts/run.sh` with the actual path to your `run.sh` script.

## License

Github-Trending is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

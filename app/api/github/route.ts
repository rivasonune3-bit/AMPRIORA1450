import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const rawUsername = searchParams.get('username') || ''
    
    if (!rawUsername) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 })
    }

    // Clean username from full URL if passed
    const cleanUsername = rawUsername
      .replace(/https?:\/\/(www\.)?github\.com\//i, '')
      .replace(/\/$/, '')
      .trim()

    if (!cleanUsername) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }

    // Fetch user profile from GitHub API
    const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
      headers: {
        'User-Agent': 'AMPRIORA-App'
      },
      next: { revalidate: 3600 }
    })

    if (!userRes.ok) {
      return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 })
    }

    const userData = await userRes.json()

    // Fetch public repos from GitHub API
    const reposRes = await fetch(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=12`, {
      headers: {
        'User-Agent': 'AMPRIORA-App'
      },
      next: { revalidate: 3600 }
    })

    const reposData = reposRes.ok ? await reposRes.json() : []

    // Process languages breakdown
    const languageCounts: Record<string, number> = {}
    let totalLanguageCount = 0

    const repos = (Array.isArray(reposData) ? reposData : []).map((repo: any) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
        totalLanguageCount += 1
      }
      return {
        id: repo.id,
        name: repo.name,
        description: repo.description || 'Public repository on GitHub.',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || 'Code',
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || repo.html_url,
        topics: repo.topics || []
      }
    })

    // Format top languages
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        percentage: totalLanguageCount > 0 ? Math.round((count / totalLanguageCount) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4)

    return NextResponse.json({
      user: {
        username: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        publicRepos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
        bio: userData.bio || '',
        profileUrl: userData.html_url
      },
      repos,
      languages
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

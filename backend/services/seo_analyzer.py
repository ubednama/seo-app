from typing import Dict, Any
from bs4 import BeautifulSoup

class SEOAnalyzer:
    """
    A service class to analyze HTML content for SEO quality and calculate a score.
    """

    def analyze(self, html_content: str, response_time_ms: int, url: str) -> Dict[str, Any]:
        """
        Analyzes the HTML content and response time to generate an SEO report.

        Args:
            html_content: The raw HTML content of the page.
            response_time_ms: The page load time in milliseconds.
            url: The URL of the page being analyzed, used for internal link checking.

        Returns:
            A dictionary containing the SEO score and detailed metrics.
        """
        if not html_content:
            return {
                "score": 0,
                "title": "N/A",
                "meta_description": "N/A",
                "h1_count": 0,
                "h2_count": 0,
                "image_count": 0,
                "images_missing_alt": 0,
                "internal_links_count": 0,
                "external_links_count": 0,
                "load_time_score": "fail"
            }

        soup = BeautifulSoup(html_content, 'lxml')
        score = 100
        
        # 1. Title Analysis
        title_tag = soup.find('title')
        title_text = ""
        if not title_tag or not title_tag.string:
            score -= 20
            title_text = "Missing"
        else:
            title_text = title_tag.string.strip()
            if len(title_text) > 60 or len(title_text) < 10:
                score -= 10

        # 2. Meta Description Analysis
        meta_tag = soup.find('meta', attrs={'name': 'description'})
        meta_description_text = ""
        if not meta_tag or not meta_tag.get('content'):
            score -= 20
            meta_description_text = "Missing"
        else:
            meta_description_text = meta_tag.get('content', '').strip()

        # 3. Heading Analysis
        h1_tags = soup.find_all('h1')
        h1_count = len(h1_tags)
        if h1_count == 0:
            score -= 20
        elif h1_count > 1:
            score -= 10
        
        h2_tags = soup.find_all('h2')
        h2_count = len(h2_tags)

        # 4. Image Alt Text Analysis
        images = soup.find_all('img')
        image_count = len(images)
        missing_alt_count = 0
        alt_penalty = 0
        for img in images:
            alt = img.get('alt', '').strip()
            if not alt:
                missing_alt_count += 1
                if alt_penalty < 20:
                    score -= 5
                    alt_penalty += 5
        
        # 5. Link Analysis
        internal_links_count = 0
        external_links_count = 0
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            if href.startswith('/') or href.startswith(base_url):
                internal_links_count += 1
            elif href.startswith('http'):
                external_links_count += 1


        # 6. Load Time Analysis
        load_time_status = "pass"
        if response_time_ms > 2000:
            score -= 15
            load_time_status = "fail"

        # Ensure score is not negative
        final_score = max(0, score)

        return {
            "score": final_score,
            "title": title_text,
            "meta_description": meta_description_text,
            "h1_count": h1_count,
            "h2_count": h2_count,
            "image_count": image_count,
            "images_missing_alt": missing_alt_count,
            "internal_links_count": internal_links_count,
            "external_links_count": external_links_count,
            "load_time_score": load_time_status
        }

from urllib.parse import urlparse
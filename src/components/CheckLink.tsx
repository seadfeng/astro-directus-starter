import { type ChangeEvent, Fragment, useState } from "react";
import { type ResponseInfo } from "types";
import apiClient from "@utils/api";
import { Results } from "./Results";

const isValidUrl = (url: string): boolean => {
  // Regular expression to match common URL patterns
  const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]{1,5})?(\/.*)?$/;
  return urlPattern.test(url);
};
const userAgents: {
  [key: string]: Record<string, string>[];
} = {
  Robots: [
    {
      "Googlebot/2.1 (Desktop)":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
    {
      "Googlebot/2.1 (Mobile)":
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.90 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
    {
      "Bingbot/2.0 (Desktop)":
        "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    },
    {
      "Bingbot/2.0 (Mobile)":
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.90 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    },
    {
      "Applebot/0.1 (Desktop)":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
    },
    {
      "Applebot/0.1 (Mobile)":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1 (Applebot/0.1; +http://www.apple.com/go/applebot)",
    },
    {
      "YandexBot/3.0":
        "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    },
    {
      DuckDuckBot: "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
    },
    { Openai: "OpenAI Language Model ChatGPT/1.0" },
  ],
  Mobile: [
    {
      "iPhone/Safari iOS":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
    },
    {
      "iPad/Safari iOS":
        "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
    },
    {
      Android:
        "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Mobile Safari/537.36",
    },
    {
      "Samsung Internet":
        "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.0 Chrome/87.0.4280.141 Mobile Safari/537.36",
    },
  ],
  Desktop: [
    {
      Chrome:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
    {
      Edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
    },
    {
      Firefox:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    },
    {
      Safari:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    },
    {
      "IE 11":
        "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
    },
  ],
};
export function CheckLink() {
  const defaultUserAgent = Object.entries(userAgents["Robots"][0])[0][1];
  const [fetching, setFetching] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [urls, setUrls] = useState<string[]>([]);
  const [infos, setInfos] = useState<{
    [key: string]: { userAgent: string; infos: ResponseInfo[] };
  }>({});
  const [userAgent, setUserAgent] = useState<string>(defaultUserAgent);
  const [invalidUrls, setInvalidUrls] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputUrls = e.target.value.split("\n").map(url => url.trim());
    const uniqueUrls = Array.from(new Set(inputUrls));
    const validUrls = uniqueUrls.filter(url => isValidUrl(url));
    const invalidUrls = uniqueUrls.filter(url => !isValidUrl(url));
    setCount(uniqueUrls.length);
    if (invalidUrls.length === 0) {
      setUrls(validUrls);
      setInvalidUrls([]);
    } else {
      setInvalidUrls(invalidUrls);
    }
  };
  const handleChangeUa = (e: ChangeEvent<HTMLSelectElement>) => {
    setUserAgent(e.target.value);
  };
  const handleSubmit = () => {
    urls.forEach((__url, index) => {
      setFetching(prev => ({ ...prev, [index]: true }));
      setInfos(prev => ({
        ...prev,
        [index]: {
          userAgent: userAgent,
          infos: [],
        },
      }));
    });
    urls.forEach((url, index) => {
      apiClient
        .post("/redirectcheck", {
          url,
          headers: {
            "User-Agent": userAgent,
          },
        })
        .then((res: any) => {
          setInfos(prev => ({
            ...prev,
            [index]: {
              userAgent: userAgent,
              infos: res,
            },
          }));
          setFetching(prev => ({ ...prev, [index]: false }));
        })
        .catch((error: any) => {
          setError(prev => ({ ...prev, [index]: error.message }));
          console.log("error", error);
          setFetching(prev => ({ ...prev, [index]: false }));
        });
    });
  };
  const isFetching =
    Object.entries(fetching).filter(([_, isFetching]) => isFetching).length > 0;

  const disabled = count > 10 || invalidUrls.length > 0 || isFetching;

  return (
    <div className="max-w-4xl mx-auto w-full leading-9 text-base flex flex-col">
      <textarea
        id="comment"
        name="comment"
        rows={4}
        onChange={handleChange}
        placeholder={"https://example1.com\nhttps://example2.com"}
        className="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      <div>
        <div>
          <select
            id="userAgent"
            name="userAgent"
            defaultValue={userAgent}
            onChange={handleChangeUa}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option disabled>User-Agent</option>
            {Object.entries(userAgents).map(([key, group]) => {
              return (
                <Fragment key={key}>
                  <option disabled>
                    &lt;============ {key} ============&gt;
                  </option>
                  {group.map(opt => {
                    const [key2] = Object.entries(opt)[0];
                    return (
                      <option key={key2} value={`${key};${key2}`}>
                        {key2}
                      </option>
                    );
                  })}
                </Fragment>
              );
            })}
          </select>
        </div>
        <div className="text-red-600 flex flex-col">
          <div className="flex justify-between items-center">
            {invalidUrls.length > 0 && <b>URL formatting error:</b>}
            <button
              onClick={() => handleSubmit()}
              disabled={disabled}
              className={`${disabled ? "opacity-50" : ""} ml-auto h-10 inline-flex my-2 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {count > 10 ? "Limit: 10 Urls" : "Check Links"}
            </button>
          </div>
          {invalidUrls.length > 0 && (
            <ul>
              {invalidUrls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="results">
          {Object.entries(infos).map(([key, info]) => {
            return (
              <Results
                key={key}
                infos={info.infos}
                userAgent={info.userAgent}
                fetching={fetching[key]}
                error={error[key] || ""}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

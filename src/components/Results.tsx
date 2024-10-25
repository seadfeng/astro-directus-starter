import type { ResponseInfo } from "types";

interface Props {
  infos: ResponseInfo[];
  userAgent: string;
  fetching: boolean;
  error: string;
}
export function Results({ infos, userAgent, fetching, error }: Props) {
  const fromUrl = infos.length > 0 ? infos[0].url : "";
  return (
    <div>
      {error && <div className="bg-red-400/65 rounded-md my-5"> {error} </div>}
      {infos.length > 0 ? (
        <div className="bg-blue-300/20 p-5 text-xl flex flex-col gap-5 rounded-lg my-5">
          <div className="font-semibold flex items-center">
            Results For: {fromUrl}
          </div>
          <div className="text-xs text-pretty">User-Agent: {userAgent}</div>
          {infos.map((info, index) => (
            <div key={index}>
              {info.location && (
                <div className="flex flex-col gap-3 font-medium">
                  {index === 0 && (
                    <div className="font-semibold">Redirect Info: </div>
                  )}
                  <div className="bg-white leading-8 text-base rounded-md p-3">
                    <div className="text-primary truncate">
                      {index + 1}. From: {info.url}
                    </div>
                    <div className="text-green-800 truncate">
                      To: {info.location}
                    </div>
                    <div className="text-orange-600">Status: {info.status}</div>
                    {info.metaRefresh && (
                      <div className="text-orange-500">Meta Refresh</div>
                    )}
                    <div
                      className={`${parseInt(info.duration.split(".")[0], 10) <= 1 ? "text-green-500" : "text-red-300"}`}
                    >
                      Duration: {info.duration}
                    </div>
                  </div>
                </div>
              )}
              {!info.location && (
                <div
                  data-status={info.status}
                  className="flex flex-col gap-3 font-medium"
                >
                  <div
                    data-status={info.status}
                    className="font-semibold data-[status='0']:text-red-500"
                  >
                    Final:
                  </div>
                  <div
                    data-status={info.status}
                    className="bg-white rounded-md data-[status='0']:bg-red-500 data-[status=0]:bg-opacity-5 p-3 leading-8 text-base"
                  >
                    <div
                      data-status={info.status}
                      className="text-green-800 data-[status='0']:text-red-500 truncate"
                    >
                      URL: {info.url}
                    </div>
                    <div className="text-orange-600 data-[status='0']:text-yellow-700">
                      Status: {info.status}
                    </div>
                    <div
                      className={`${parseInt(info.duration.split(".")[0], 10) <= 1 ? "text-green-500" : "text-red-300"}`}
                    >
                      Duration: {info.duration}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          {fetching && (
            <div className="animate-pulse rounded-md bg-blue-300/20 my-5 h-40 w-full"></div>
          )}
        </>
      )}
    </div>
  );
}

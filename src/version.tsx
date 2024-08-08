export const version = "b-0.7.2";

const User = ({ user }: { user: string }) => (
  <span className="cursor-pointer bg-[rgba(255,165,0,0.25);] rounded p-[2.5px]">
    {user}
  </span>
);

export const Changelog = () => (
  <>
    <div>
      Running on commit{" "}
      <code>
        <a
          href={`https://github.com/DeveloLongScript/mhsf/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
        >
          {(
            process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown"
          ).substring(0, 7)}
        </a>{" "}
        {process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID != undefined &&
          process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID != "" && (
            <>
              {" "}
              | on PR{" "}
              <a
                href={`https://github.com/DeveloLongScript/MHSF/pull/${process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID}`}
              >
                {process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID}
              </a>{" "}
              by{" "}
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}`}
              >
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}
              </a>
            </>
          )}{" "}
        {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE != undefined &&
          `| ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}`}
      </code>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.7.2 (August 7th 2024)
      </strong>
      <ul>
        <li>• Adding new spinners to pages that needed it</li>
        <li>• Fixed lots of bugs</li>
        <li>• Moved from Inngest to Vercel Cron</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.7.0 (August 7th 2024)
      </strong>
      <ul>
        <li>• Added customization to servers</li>
        <li>• New button focus effect</li>
        <li>• Lots of bugfixes</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.6.0 (August 3rd 2024)
      </strong>
      <ul>
        <li>• Enhanced shortcuts</li>
        <li>• Added gradient beam to player count</li>
        <li>• Updated loading animations</li>
        <li>• Lots of bugfixes</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.4.5 (July 26th 2024):
      </strong>
      <ul>
        <li>• Made charts better</li>
        <li>• Sorted API endpoints</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.4 (July 25th 2024):
      </strong>
      <ul>
        <li>• Added Info button</li>
        <li>• Fixed Clerk in production</li>
        <li>• Added Turbo for faster builds</li>
        <li>
          • <strong>Added historical data</strong>
        </li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.3 (July 23th 2024):
      </strong>
      <ul>
        <li>
          • Fixed minor bugs described by <User user="@Tarna" />
        </li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.2 (July 23th 2024):
      </strong>
      <ul>
        <li>• Inital release!</li>
      </ul>
    </div>
  </>
);

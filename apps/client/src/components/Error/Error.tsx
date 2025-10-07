"use client";

const ErrorPage = ({ reset }: { reset: () => void }) => {
  return (
    <div>
      <div>
        <div>
          <div>
            <h3>Whoopsies! We made a mess.</h3>
          </div>
          <div>
            <p>
              Failed to fetch. It&apos;s not you, it&apos;s us.
              We&apos;re not sure where the page you&apos;re looking
              for is. Please reload the page.
            </p>
          </div>
          <div>
            <button
              onClick={reset}
              className="bg-[#b5882e] text-white px-3 py-1 row-auto rounded font-medium"
            >
              Refresh page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

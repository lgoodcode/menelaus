import './GameCard.css'

export default function GameCard({ game }: { game: Game }) {
  return (
    <div key={game.id} className="game-card">
      <div className="card-img overflow-hidden relative w-full h-[180px]">
        {/* Using background-image over an img because of the fact that the image will be
            restricted to the parent's dimensions. */}
        <div
          className="absolute inset-0 w-full h-full bg-[50%] bg-cover bg-no-repeat rounded-t-lg"
          style={{ backgroundImage: `url(${game.background_image})` }}
        />
      </div>

      <div className="game-card-content p-4 bg-purple-800 rounded-b-lg">
        {/* <div className="platforms-and-ratings">
          <div className="platforms"></div>
        </div> */}
        <div className="name-and-rating">
          <div className="flex flex-row justify-between relative">
            <h3 className="text-lg font-semibold font-mont break-words w-[calc(100%-42px)]">
              {game.name}
            </h3>

            <div
              data-tooltip="Metascore"
              className={`metacritic absolute right-0 p-[1px] px-1 border-[1px] rounded-md ${
                game.metacritic > 80
                  ? 'border-green-600'
                  : game.metacritic > 60
                  ? 'border-yellow-500'
                  : 'border-red-600'
              }`}
            >
              <span
                className={`text-sm ${
                  game.metacritic > 80
                    ? 'text-green-500'
                    : game.metacritic > 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {game.metacritic}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

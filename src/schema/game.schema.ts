import { object, string, number, TypeOf } from "zod";

// 'part' of the schema - body is an object containing a game id which is a string.
// this is required. 
const payload = {
    // all the stuff needed for creating a game - its fields
    body: object({
        playerOne: string({
            required_error: "player1 Id required.",
        }),
        playerTwo: string({
            required_error: "player2 Id required."
        }),
        firstPlayer: number({
            required_error: "first player required."
        }),
        boardSize: number({
            required_error: "board size required."
        }),
        username: string({
            required_error: "username is required."
        })
    }),
}

const getParams = {
    params: object({
        gameid: string({
            required_error: "game Id required.",
        })
    })
}

const makeMoveParams = {
    params: object({
        gameid: string({
            required_error: "game Id required.",
        }),
        move: string({
            required_error: "move index required."
        })
    })
}

// export const createBookingSchema = object({
//    ...payload
// });

// export const deleteBookingSchema = object({
//    ...updateDeleteParams
// })

export const getGamesSchema = object({
    // nothing required
})

export const getGameByIdSchema = object({
    ...getParams
})

export const createGameSchema = object({
    ...payload
})

export const makeMoveSchema = object({
    ...makeMoveParams
})

export const getGameByUsernameSchema = object({
    params: object({
        username: string({
            required_error: "username required."
        })
    })
})

// this one allows to create the type is typescript based on the above
// definitions so you onyl have to define it once
// export type CreateGameSchemaInput = TypeOf<typeof createGameSchema>;
/**
 * It takes an error object, and returns a JSON object with the error's status, message, and code
 * @param err - The error object that was thrown.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
import ApiError from "../error/ApiError";

const GenericErrorHandler = (err, req, res, next) => {
    if (!err instanceof ApiError){
        console.error(err);
    }
    if(/\w+ validation failed: \w+/i.test(err.message)){
        err.message = err.message.replace(/\w+ validation failed: /i, '');
    }
    res.status(err.status || 500).json({
        status: err?.status,
        error: err?.message,
        code:err.code,
    });
}
export default GenericErrorHandler;
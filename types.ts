//
// 1. TelegramUpdate Interface
//

export interface TelegramUpdate {
    update_id: number;
  
    // These fields are mutually exclusive, depending on the type of update:
    message?: Message;
    edited_message?: Message;
    channel_post?: Message;
    edited_channel_post?: Message;
    inline_query?: InlineQuery;
    chosen_inline_result?: ChosenInlineResult;
    callback_query?: CallbackQuery;
    shipping_query?: ShippingQuery;
    pre_checkout_query?: PreCheckoutQuery;
    poll?: Poll;
    poll_answer?: PollAnswer;
    my_chat_member?: ChatMemberUpdated;
    chat_member?: ChatMemberUpdated;
    chat_join_request?: ChatJoinRequest;
  }
  
  //
  // 2. Sub-Interfaces
  //
  
  /**
   * Basic user info. This can be expanded to include
   * language_code, is_premium, added_to_attachment_menu, etc.
   */
  export interface User {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
  }
  
  /**
   * Basic chat info. Chat objects can be groups, supergroups,
   * channels, or private chats.
   */
  export interface Chat {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    // ... Add other optional fields from the Telegram docs as needed
  }
  
  /**
   * Represents a message. Only a small subset of fields is shown here.
   * In reality, messages can have many more fields (photo, video, etc.).
   */
  export interface Message {
    message_id: number;
    from?: User;
    chat: Chat;
    date: number; // Unix timestamp
    text?: string;
    // ... Add other optional fields from the Telegram docs as needed
  }
  
  /**
   * Sent when a user taps an inline query in the text input field.
   * The user can type queries, the bot returns results, etc.
   */
  export interface InlineQuery {
    id: string;
    from: User;
    query: string;
    offset: string;
    // ... optionally: location, chat_type, etc.
  }
  
  /**
   * The result of a user selecting an inline query result.
   */
  export interface ChosenInlineResult {
    result_id: string;
    from: User;
    query: string;
    // ... optionally: location, inline_message_id, etc.
  }
  
  /**
   * Data sent when a user presses an inline keyboard button
   * or a game button, etc.
   */
  export interface CallbackQuery {
    id: string;
    from: User;
    message?: Message;
    inline_message_id?: string;
    chat_instance: string;
    data?: string;
    // ... optionally: game_short_name, etc.
  }
  
  /**
   * Required for shipping queries in Telegram payment flows.
   */
  export interface ShippingQuery {
    id: string;
    from: User;
    invoice_payload: string;
    shipping_address: ShippingAddress;
  }
  
  /**
   * Basic shipping address structure.
   */
  export interface ShippingAddress {
    country_code: string;
    state: string;
    city: string;
    street_line1: string;
    street_line2: string;
    post_code: string;
  }
  
  /**
   * Required for pre-checkout queries in Telegram payment flows.
   */
  export interface PreCheckoutQuery {
    id: string;
    from: User;
    currency: string;
    total_amount: number;
    invoice_payload: string;
    shipping_option_id?: string;
    // order_info?: any; // or a more specific interface if needed
  }
  
  /**
   * Poll object (regular or quiz).
   */
  export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    total_voter_count: number;
    is_closed: boolean;
    is_anonymous: boolean;
    type: string; // "regular" or "quiz"
    allows_multiple_answers: boolean;
    // ... optionally: correct_option_id, explanation, etc.
  }
  
  export interface PollOption {
    text: string;
    voter_count: number;
  }
  
  /**
   * A user’s answer to a non-closed poll.
   */
  export interface PollAnswer {
    poll_id: string;
    user: User;
    option_ids: number[];
  }
  
  /**
   * Describes changes in the status of a chat member.
   */
  export interface ChatMemberUpdated {
    chat: Chat;
    from: User;
    date: number;
    old_chat_member: ChatMember;
    new_chat_member: ChatMember;
    invite_link?: ChatInviteLink;
    // ... possibly other fields
  }
  
  /**
   * Basic info about a chat member. This can be expanded.
   */
  export interface ChatMember {
    user: User;
    status: string; // "creator", "administrator", "member", etc.
    // ... other permission fields, such as is_anonymous, can_manage_chat, etc.
  }
  
  /**
   * Represents an invite link for a chat.
   */
  export interface ChatInviteLink {
    invite_link: string;
    creator: User;
    creates_join_request: boolean;
    is_primary: boolean;
    is_revoked: boolean;
    // ... other fields like name, expire_date, member_limit, etc.
  }
  
  /**
   * Represents a join request sent to a chat.
   */
  export interface ChatJoinRequest {
    chat: Chat;
    from: User;
    date: number;
    bio?: string;
    invite_link?: ChatInviteLink;
  }
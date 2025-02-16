## Here are the backend endpoints:

### Backend endpoints:

1. (base URL)/api/poll/create - To create the poll.
2. (base URL)/api/poll/fetch/:pollId - To fetch the poll data.
3. (base URL)/api/poll/fetch/vote - For voting to the poll with an option.

### Frontend endpoints:

1. (base URL)/create - For poll creation page.
2. (base URL)/poll/:pollId - The actual poll page with pollId params in which user can actually vote.

## Here is the prisma based database schema:

```prisma
model Poll {
  id        String   @id @default(uuid())
  owner     String
  question  String
  options   Option[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Option {
  id        String   @id @default(uuid())
  option    String
  votes     Int      @default(0)
  pollId    String
  poll      Poll     @relation(fields: [pollId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
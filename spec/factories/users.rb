FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "#{n}#{Faker::Internet.email}" }
    sequence(:username) { |n| "#{Faker::Internet.user_name}#{n}" }
    password 'password'
    password_confirmation 'password'
  end
end

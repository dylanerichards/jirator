class JiraService
  include HTTParty
  
  def initialize
    @domain = ENV['JIRA_DOMAIN']
    @auth = {
      username: ENV['JIRA_EMAIL'],
      password: ENV['JIRA_API_TOKEN']
    }
    self.class.base_uri "https://#{@domain}/rest/api/3"
  end

  def create_issue(ticket_data)
    Rails.logger.info "Creating JIRA issue with data: #{ticket_data.inspect}"
    
    body = {
      fields: {
        project: { 
          key: ticket_data[:project_key]
        },
        summary: ticket_data[:summary],
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: ticket_data[:description].presence || "No description provided",
                  type: "text"
                }
              ]
            }
          ]
        },
        issuetype: { name: "Task" },
        priority: { name: ticket_data[:priority] },
        labels: ticket_data[:labels]&.split(',')&.map(&:strip),
        assignee: ticket_data[:assignee].present? ? { id: find_user_id(ticket_data[:assignee]) } : nil
      }
    }

    Rails.logger.info "Sending request to JIRA API with body: #{body.inspect}"
    
    response = self.class.post(
      '/issue',
      body: body.to_json,
      basic_auth: @auth,
      headers: { 'Content-Type' => 'application/json' }
    )

    unless response.success?
      Rails.logger.error "JIRA API Error: #{response.code} - #{response.body}"
    end

    response
  end

  private

  def find_user_id(username)
    response = self.class.get(
      "/user/search?query=#{username}",
      basic_auth: @auth
    )
    response.first&.dig('accountId')
  end
end 